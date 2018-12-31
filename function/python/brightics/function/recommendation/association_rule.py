from sklearn import preprocessing
import itertools
import math
import pandas as pd
import matplotlib.pyplot as plt
from brightics.common.report import ReportBuilder, strip_margin, plt2MD, pandasDF2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
import numpy as np

            
#-----------------------------------------------------------------------------------------------------
"""
License:
  Copyright (c) 2016, Evan Dempsey 
  All rights reserved. 
  

  Permission to use, copy, modify, and/or distribute this software for any 
  purpose with or without fee is hereby granted, provided that the above 
  copyright notice and this permission notice appear in all copies. 
  
 
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES 
  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF 
  MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR 
  ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES 
  WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN 
  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF 
  OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE. 
"""

class _FPNode(object):
    """
    A node in the FP tree.
    """

    def __init__(self, value, count, parent):
        """
        Create the node.
        """
        self.value = value
        self.count = count
        self.parent = parent
        self.link = None
        self.children = []

    def _has_child(self, value):
        """
        Check if node has a particular child node.
        """
        for node in self.children:
            if node.value == value:
                return True

        return False

    def _get_child(self, value):
        """
        Return a child node with a particular value.
        """
        for node in self.children:
            if node.value == value:
                return node

        return None

    def _add_child(self, value):
        """
        Add a node as a child node.
        """
        child = _FPNode(value, 1, self)
        self.children.append(child)
        return child


class _FPTree(object):
    """
    A frequent pattern tree.
    """

    def __init__(self, transactions, threshold, root_value, root_count):
        """
        Initialize the tree.
        """
        self.frequent = self._find_frequent_items(transactions, threshold)
        self.headers = self._build_header_table(self.frequent)
        self.root = self._build_fptree(
            transactions, root_value,
            root_count, self.frequent, self.headers)

    @staticmethod
    def _find_frequent_items(transactions, threshold):
        """
        Create a dictionary of items with occurrences above the threshold.
        """
        items = {}
        for transaction in transactions:
            for item in transaction:
                if item in items:
                    items[item] += 1
                else:
                    items[item] = 1
        for key in list(items.keys()):
            if items[key] < threshold:
                del items[key]

        return items

    @staticmethod
    def _build_header_table(frequent):
        """
        Build the header table.
        """
        headers = {}
        for key in frequent.keys():
            headers[key] = None

        return headers

    def _build_fptree(self, transactions, root_value,
                     root_count, frequent, headers):
        """
        Build the FP tree and return the root node.
        """
        root = _FPNode(root_value, root_count, None)

        for transaction in transactions:
            sorted_items = [x for x in transaction if x in frequent]
            sorted_items.sort(key=lambda x: frequent[x], reverse=True)
            if len(sorted_items) > 0:
                self._insert_tree(sorted_items, root, headers)

        return root

    def _insert_tree(self, items, node, headers):
        """
        Recursively grow FP tree.
        """
        first = items[0]
        child = node._get_child(first)
        if child is not None:
            child.count += 1
        else:
            # Add new child.
            child = node._add_child(first)

            # Link it to header structure.
            if headers[first] is None:
                headers[first] = child
            else:
                current = headers[first]
                while current.link is not None:
                    current = current.link
                current.link = child

        # Call function recursively.
        remaining_items = items[1:]
        if len(remaining_items) > 0:
            self._insert_tree(remaining_items, child, headers)

    def _tree_has_single_path(self, node):
        """
        If there is a single path in the tree,
        return True, else return False.
        """
        num_children = len(node.children)
        if num_children > 1:
            return False
        elif num_children == 0:
            return True
        else:
            return True and self._tree_has_single_path(node.children[0])

    def _mine_patterns(self, threshold):
        """
        Mine the constructed FP tree for frequent patterns.
        """
        if self._tree_has_single_path(self.root):
            return self._generate_pattern_list()
        else:
            return self._zip_patterns(self._mine_sub_trees(threshold))

    def _zip_patterns(self, patterns):
        """
        Append suffix to patterns in dictionary if
        we are in a conditional FP tree.
        """
        suffix = self.root.value

        if suffix is not None:
            # We are in a conditional tree.
            new_patterns = {}
            for key in patterns.keys():
                new_patterns[tuple(sorted(list(key) + [suffix]))] = patterns[key]

            new_patterns[tuple([self.root.value])] = self.root.count
                
            return new_patterns

        return patterns

    def _generate_pattern_list(self):
        """
        Generate a list of patterns with support counts.
        """
        patterns = {}
        items = self.frequent.keys()

        # If we are in a conditional tree,
        # the suffix is a pattern on its own.
        if self.root.value is None:
            suffix_value = []
        else:
            suffix_value = [self.root.value]
            patterns[tuple(suffix_value)] = self.root.count

        for i in range(1, len(items) + 1):
            for subset in itertools.combinations(items, i):
                pattern = tuple(sorted(list(subset) + suffix_value))
                patterns[pattern] = \
                    min([self.frequent[x] for x in subset])

        return patterns

    def _mine_sub_trees(self, threshold):
        """
        Generate subtrees and mine them for patterns.
        """
        patterns = {}
        mining_order = sorted(self.frequent.keys(),
                              key=lambda x: self.frequent[x])

        # Get items in tree in reverse order of occurrences.
        for item in mining_order:
            suffixes = []
            conditional_tree_input = []
            node = self.headers[item]

            # Follow node links to get a list of
            # all occurrences of a certain item.
            while node is not None:
                suffixes.append(node)
                node = node.link

            # For each occurrence of the item, 
            # trace the path back to the root node.
            for suffix in suffixes:
                frequency = suffix.count
                path = []
                parent = suffix.parent

                while parent.parent is not None:
                    path.append(parent.value)
                    parent = parent.parent

                for i in range(frequency):
                    conditional_tree_input.append(path)

            # Now we have the input for a subtree,
            # so construct it and grab the patterns.
            subtree = _FPTree(conditional_tree_input, threshold,
                             item, self.frequent[item])
            subtree_patterns = subtree._mine_patterns(threshold)

            # Insert subtree patterns into main patterns dictionary.
            for pattern in subtree_patterns.keys():
                if pattern in patterns:
                    patterns[pattern] += subtree_patterns[pattern]
                else:
                    patterns[pattern] = subtree_patterns[pattern]

        return patterns


def _find_frequent_patterns(transactions, support_threshold):
    """
    Given a set of transactions, find the patterns in it
    over the specified support threshold.
    """
    support_threshold*=len(transactions)
    tree = _FPTree(transactions, support_threshold, None, None)
    return tree._mine_patterns(support_threshold)


def _generate_association_rules(patterns, confidence_threshold):
    """
    Given a set of frequent itemsets, return a dict
    of association rules in the form
    {(left): ((right), confidence)}
    """
    rules = {}
    for itemset in patterns.keys():
        union_frequent = patterns[itemset]

        for i in range(1, len(itemset)):
            for antecedent in itertools.combinations(itemset, i):
                antecedent = tuple(sorted(antecedent))
                consequent = tuple(sorted(set(itemset) - set(antecedent)))

                if antecedent in patterns:
                    antecedent_frequent = patterns[antecedent]
                    consequent_frequent = patterns[consequent]
                    confidence = float(union_frequent)/antecedent_frequent

                    if confidence >= confidence_threshold:
                        rule1=(consequent, union_frequent, antecedent_frequent, consequent_frequent)
                        rule1=list(rule1)
                        if antecedent in rules:
                            rules[antecedent].append(rule1)
                        else:
                            rules[antecedent]=[rule1]

    return rules


#----------------------------------------------------------------------------------------------------------------

def _dict_to_table(rules,len_trans):
    result=[]
    for items in rules.keys():
        for elements in rules[items]:
            support_ante = elements[2]/len_trans
            support_conse = elements[3]/len_trans
            support_both = elements[1]/len_trans
            confidence = elements[1]/elements[2]
            lift = confidence/elements[3]*len_trans
            if confidence == 1:
                conviction = math.inf
            else:
                conviction = (1-elements[3]/len_trans)/(1-confidence)
            result+=[[list(items),list(elements[0]),support_both,confidence,lift,conviction,support_ante,support_conse]]
    result=pd.DataFrame.from_records(result)
    result.columns=['antecedent','consequent','support','confidence','lift','conviction','support_antecedent','support_consequent']
    return result

def _table_to_transactions(table,items,user_name):
    label_encoder = preprocessing.LabelEncoder()
    label_encoder.fit(table[user_name])
    labels=label_encoder.transform(table[user_name])
    result=[]
    for i in range(len(label_encoder.classes_)):
        result+=[[]]
    for j in range(len(table[user_name])):
        result[labels[j]]+=[table[items][j]]
    return result

def _n_blank_strings(number):
    result=''
    for i in range(number):
        result+=' '
    return result

def _check_blank_string(string):
    if(len(string))==0:
        return False
    for i in range(len(string)):
        if string[i] != ' ':
            return False
    return True
        

def association_rule(table, group_by=None, **params):
    check_required_parameters(_association_rule, params, ['table'])
    if group_by is not None:
        return _function_by_group(_association_rule, table, group_by=group_by, **params)
    else:
        return _association_rule(table, **params)

def _association_rule(table,items,user_name,min_support=0.01,min_confidence=0.8,min_lift=-math.inf,max_lift=math.inf,min_conviction=-math.inf,max_conviction=math.inf):
    table_erase_duplicates = table.copy()
    table_erase_duplicates = table_erase_duplicates.drop_duplicates([items]+[user_name])
    table_erase_duplicates = table_erase_duplicates.reset_index()
    transactions = _table_to_transactions(table_erase_duplicates,items,user_name)
    len_trans=len(transactions)
    patterns = _find_frequent_patterns(transactions, min_support)
    rules = _generate_association_rules(patterns, min_confidence)
    if len(rules) == 0:
        return {'out_table' : rules}
    result = _dict_to_table(rules,len_trans)
    result = result[(result.lift >min_lift) & (result.conviction > min_conviction) & (result.lift < max_lift) & (result.conviction < max_conviction)]
    return {'out_table' : result}
    
    
    
def _scaling(number_list):
    maximum = np.max(number_list)
    minimum = np.min(number_list)
    result=[]
    for number in number_list:
        result += [(number - minimum)/(maximum-minimum)+0.2]
    return result
    

def association_rule_visualization(table, group_by=None, **params):
    check_required_parameters(_association_rule_visualization, params, ['table'])
    if group_by is not None:
        return _function_by_group(_association_rule_visualization, table, group_by=group_by, **params)
    else:
        return _association_rule_visualization(table, **params)    
    
def _association_rule_visualization(table, option='multiple_to_single', edge_length_scaling = 1,font_size = 20, node_size_scaling = 1, figure_size_muliplier=1):

    if(option == 'single_to_single'):
        result_network = table.copy()

        length_ante = []
        string_ante = []
        length_conse = []
        string_conse = []
        for row in result_network['antecedent']:
            length_ante+=[len(row)]
            string_ante+=[row[0]]
        for row in result_network['consequent']:
            length_conse+=[len(row)]
            string_conse+=[row[0]]
        result_network['length_ante'] = length_ante
        result_network['string_ante'] = string_ante
        result_network['length_conse'] = length_conse
        result_network['string_conse'] = string_conse
        result_network = result_network[result_network.length_ante == 1]
        result_network = result_network[result_network.length_conse == 1]
        #edges_colors = preprocessing.LabelEncoder()
        #edges_colors.fit(result_network['lift'])


        #edges_colors = edges_colors.transform(result_network['lift'])
        #result_network['edge_colors'] = edges_colors

        result_network = result_network.reset_index()
        edges = []
        for i in range(len(result_network.string_ante)):
            edges += [(result_network.string_ante[i],result_network.string_conse[i])]

        G = nx.DiGraph()
        G.add_edges_from(edges)
        nodes = G.nodes()
        plt.figure(figsize=(4*len(nodes)**0.5*figure_size_muliplier,4*len(nodes)**0.5*figure_size_muliplier))
        pos = nx.spring_layout(G,k=0.4*edge_length_scaling)

        node_tmp = list(result_network.string_ante)+list(result_network.string_conse)
        support_tmp = list(result_network.support_antecedent)+list(result_network.support_consequent)
        tmp_node_support=[]
        for i in range(len(node_tmp)):
            tmp_node_support+=[[node_tmp[i],support_tmp[i]]]
        nodes_table = pd.DataFrame.from_records(tmp_node_support, columns=['name','support'])
        nodes_table = nodes_table.drop_duplicates(['name'])
        node_color = []
        nodes_table = nodes_table.reset_index()
        scaled_support = _scaling(nodes_table.support)
        for node in nodes:
            for i in range(len(nodes_table.name)):
                if nodes_table.name[i] == node:
                    node_color += [scaled_support[i]*2500*node_size_scaling]
                    break
        #if(scaling==True):
       #     edge_color = [result_network['edge_colors'][n] for n in range(len(result_network['length_conse']))]
        #else:
        scaled_support = _scaling(result_network['confidence'])
        edge_size = [scaled_support[n]*8 for n in range(len(result_network['length_conse']))]
        edge_color = [result_network['lift'][n] for n in range(len(result_network['length_conse']))]
        nx.draw(G, pos, node_color=node_color, edge_color=edge_color, node_size=node_color, arrowsize=20*(0.2+0.8*node_size_scaling), font_family='NanumGothic', 
                with_labels=True, cmap=plt.cm.Blues, edge_cmap=plt.cm.Reds, arrows=True, edge_size=edge_color, width=edge_size, font_size=font_size)

        fig_digraph=plt2MD(plt)
        
        graph_min_support = np.min(nodes_table.support)
        graph_max_support = np.max(nodes_table.support)
        graph_min_confidence = np.min(result_network['confidence'])
        graph_max_confidence = np.max(result_network['confidence'])
        graph_min_lift = np.min(result_network['lift'])
        graph_max_lift = np.max(result_network['lift'])
        
        rb = ReportBuilder()
        rb.addMD(strip_margin("""
        | ### Network Digraph
        | ##### Node color, size : support(of antecedent) ({graph_min_support}~{graph_max_support})
        | ##### Edge color : lift ({graph_min_lift}~{graph_max_lift})
        | ##### Edge size : confidence ({graph_min_confidence}~{graph_max_confidence})
        | {image1}
        |
        """.format(image1=fig_digraph, graph_min_support=graph_min_support,graph_max_support=graph_max_support,graph_min_lift=graph_min_lift,graph_max_lift=graph_max_lift,graph_min_confidence=graph_min_confidence,graph_max_confidence=graph_max_confidence)))
    
    elif(option == 'multiple_to_single'):

        result_network = table.copy()
        length_ante = []
        string_ante = []
        length_conse = []
        string_conse = []
        for row in result_network['consequent']:
            length_conse+=[len(row)]
            string_conse+=[row[0]]
        result_network['length_conse'] = length_conse
        result_network['consequent'] = string_conse
        result_network = result_network[result_network.length_conse == 1]
        result_network = result_network.reset_index()
        rownum=[]
        for i in range(len(result_network['consequent'])):
            rownum += [_n_blank_strings(i+1)]
        result_network['row_number'] = rownum
        edges=[]
        for i in range(len(result_network.consequent)):
            for j in range(len(result_network.antecedent[i])):
                edges += [(result_network.antecedent[i][j],result_network['row_number'][i])]
            edges += [(result_network['row_number'][i], result_network.consequent[i])]

        G = nx.DiGraph()
        G.add_edges_from(edges)
        nodes = G.nodes()
        plt.figure(figsize=(2*len(nodes)**0.5*figure_size_muliplier,2*len(nodes)**0.5*figure_size_muliplier))
        pos = nx.spring_layout(G,k=0.2*edge_length_scaling)
        nodes_color = []
        nodes_size = []
        scaled_lift = _scaling(result_network.lift)
        for node in nodes:
            if _check_blank_string(node):

                nodes_color += [result_network.support[len(node)-1]]
                nodes_size += [scaled_lift[len(node)-1]*2000*node_size_scaling]
            else:
                nodes_color += [0]
                nodes_size += [0]

        nx.draw(G, pos, node_color=nodes_color,  node_size=nodes_size, font_family='NanumGothic', 
                with_labels=True, cmap=plt.cm.Reds, arrows=True, edge_color='Grey', font_weight='bold',arrowsize=20*(0.2+0.8*node_size_scaling), font_size=font_size)
        fig_digraph=plt2MD(plt)
        
        graph_min_support = np.min(result_network.support)
        graph_max_support = np.max(result_network.support)
        graph_min_lift = np.min(result_network.lift)
        graph_max_lift = np.max(result_network.lift)
        
        rb = ReportBuilder()
        rb.addMD(strip_margin("""
        | ### Network Digraph
        | ##### Size of circle : support ({graph_min_support}~{graph_max_support})
        | ##### Color of circle : lift ({graph_min_lift}~{graph_max_lift})
        | {image1}
        |
        """.format(image1=fig_digraph,graph_min_support=graph_min_support,graph_max_support=graph_max_support,graph_min_lift=graph_min_lift,graph_max_lift=graph_max_lift)))
        
    else:
        
        result_network = table.copy()
        length_ante = []
        string_ante = []
        length_conse = []
        string_conse = []
        for row in result_network['consequent']:
            length_conse+=[len(row)]
        result_network['length_conse'] = length_conse
        result_network = result_network.reset_index()
        rownum=[]
        for i in range(len(result_network['consequent'])):
            rownum += [_n_blank_strings(i+1)]
        result_network['row_number'] = rownum
        edges=[]
        for i in range(len(result_network.consequent)):
            for j in range(len(result_network.antecedent[i])):
                edges += [(result_network.antecedent[i][j],result_network['row_number'][i])]
            for j in range(len(result_network.consequent[i])):
                edges += [(result_network['row_number'][i], result_network.consequent[i][j])]

        G = nx.DiGraph()
        G.add_edges_from(edges)
        nodes = G.nodes()
        plt.figure(figsize=(2*len(nodes)**0.5*figure_size_muliplier,2*len(nodes)**0.5*figure_size_muliplier))
        pos = nx.spring_layout(G,k=0.2*edge_length_scaling)
        nodes_color = []
        nodes_size = []
        scaled_lift = _scaling(result_network.lift)

        for node in nodes:
            if _check_blank_string(node):

                nodes_color += [result_network.support[len(node)-1]]
                nodes_size += [scaled_lift[len(node)-1]*2000*node_size_scaling]
            else:
                nodes_color += [0]
                nodes_size += [0]

        nx.draw(G, pos, node_color=nodes_color,  node_size=nodes_size, font_family='NanumGothic', 
                with_labels=True, cmap=plt.cm.Reds, arrows=True, edge_color='Grey', font_weight='bold',arrowsize=20*(0.2+0.8*node_size_scaling), font_size=font_size)
        fig_digraph=plt2MD(plt)
        
        graph_min_support = np.min(result_network.support)
        graph_max_support = np.max(result_network.support)
        graph_min_lift = np.min(result_network.lift)    
        graph_max_lift = np.max(result_network.lift)
        
        rb = ReportBuilder()
        rb.addMD(strip_margin("""
        | ### Network Digraph
        | ##### Size of circle : support ({graph_min_support}~{graph_max_support})
        | ##### Color of circle : lift ({graph_min_lift}~{graph_max_lift})
        | {image1}
        |
        """.format(image1=fig_digraph,graph_min_support=graph_min_support,graph_max_support=graph_max_support,graph_min_lift=graph_min_lift,graph_max_lift=graph_max_lift)))

    model = _model_dict('Association rule')
    model['report'] = rb.get()
    
    return{'model' : model}
    
    