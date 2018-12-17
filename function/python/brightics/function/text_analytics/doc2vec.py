from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import pandas as pd
import numpy as np
from brightics.common.report import ReportBuilder, strip_margin, pandasDF2MD
from brightics.function.utils import _model_dict

def doctovec(table, tokens_col, id_col, vector_size=100, window=5, min_count=5, workers=3, epochs=5):

	result = table.copy()
	documents = [TaggedDocument(doc, [i]) for i, doc in enumerate(result[tokens_col])]

	model = Doc2Vec(documents, vector_size=vector_size, window=window, min_count=min_count, workers=workers, epochs=epochs)
	model.train(documents, total_examples=model.corpus_count, epochs=model.epochs)

	vectors = []
	for i in result.index:
		try:
			vector = model.infer_vector(result.at[i, tokens_col])
			vectors.append(vector)
		except:
			raise("ERROR")
		  
	array_vectors = np.array(vectors)
	for i in range(model.vector_size) :
		col_name = 'vectors_' + str(i)
		result[col_name] = array_vectors[:,i]
		
	return {'out_table': result, 'model': model}


def doctovec_infer_vector(table, model, tokens_col):

    result = table.copy()
    
    vectors = []
    for i in result.index:
        try:
            vector = model.infer_vector(result.at[i, tokens_col])
            vectors.append(vector)
        except:
            raise("ERROR")

    array_vectors = np.array(vectors)
    for i in range(model.vector_size) :
        col_name = 'vectors_' + str(i)
        result[col_name] = array_vectors[:,i]
    
    return {'out_table': result}


def doctovec_similar_sentence(table, model, text_col, label_col):

    df = table.copy()
    result_sim = {}

    for i in range(10):
        temp = {}
        temp['sentence'] = []
        temp['label'] = []
        for id, vec in model.docvecs.most_similar(i):
            temp['sentence'].append(df.at[id, text_col])
            temp['label'].append(df.at[id, label_col])
        result_sim[i] = pd.DataFrame(temp)
                            
    str_MD = '## Most similar sentences \n'
                                
    for i in range(10):
        str_MD += '|' + df.at[i,'document'] + '\n'
        str_MD += '|' + pandasDF2MD(result_sim[i]) + '\n'
    rb = ReportBuilder()
    rb.addMD(strip_margin(str_MD))

    _model = _model_dict('doc2vec')
    _model['report'] = rb.get()
                                                
    return{'model': _model}
