from sklearn import preprocessing
import itertools
import math
import pandas as pd
import matplotlib.pyplot as plt
#import networkx as nx
from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, pandasDF2MD, dict2MD
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
            sorted_items.sort()
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
            support_both = elements[1]/len_trans
            confidence = elements[1]/elements[2]
            lift = confidence/elements[3]*len_trans
            if confidence == 1:
                conviction = math.inf
            else:
                conviction = (1-elements[3]/len_trans)/(1-confidence)
            result+=[[list(items),list(elements[0]),support_both,confidence,lift,conviction]]
    result=pd.DataFrame.from_records(result)
    result.columns=['antecedent','consequent','support','confidence','lift','conviction']
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


        

def association_rule(table, group_by=None, **params):
    check_required_parameters(_association_rule, params, ['table'])
    if group_by is not None:
        return _function_by_group(_association_rule, table, group_by=group_by, **params)
    else:
        return _association_rule(table, **params)

def _association_rule(table,items,user_name,min_support=0.01,min_confidence=0.8,min_lift=-math.inf,max_lift=math.inf,min_conviction=-math.inf,max_conviction=math.inf):
    table_erase_duplicates = table.drop_duplicates([items]+[user_name])
    table_erase_duplicates = table_erase_duplicates.reset_index()
    transactions = _table_to_transactions(table_erase_duplicates,items,user_name)
    len_trans=len(transactions)
    patterns = _find_frequent_patterns(transactions, min_support)
    rules = _generate_association_rules(patterns, min_confidence)
    if len(rules) == 0:
        result = pd.DataFrame(columns=['antecedent','consequent','support','confidence','lift','conviction'])
        return {'out_table' : result}
    result = _dict_to_table(rules,len_trans)
    result = result[(result.lift >= min_lift) & (result.conviction >= min_conviction) & (result.lift <= max_lift) & (result.conviction <= max_conviction)]
    return {'out_table' : result}
    
    


    