"""
    Copyright 2019 Samsung SDS

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""


import unittest
import pandas as pd
from brightics.function.textanalytics import lda


class TestLatentDirichletAllocation(unittest.TestCase):

    def setUp(self):
        print("*** Latent Dirichlet Allocation UnitTest Start ***")
        data = ['eat turkey on turkey day holiday',
              'i like to eat cake on holiday',
              'turkey trot race on thanksgiving holiday',
              'snail race the turtle',
              'time travel space race',
              'movie on thanksgiving',
              'movie at air and space museum is cool movie',
              'aspiring movie star'
            ]
        df = pd.DataFrame({'text':data})
        print(df)
        self.data = df

    def tearDown(self):
        print("*** Latent Dirichlet Allocation UnitTest End ***")

    def test_latent_dirichlet_allocation1(self):
        input_dataframe = self.data
        
        res = lda(table=input_dataframe, input_col='text', num_voca=1000, num_topic=3, num_topic_word=3, max_iter=20, learning_method='online', learning_offset=10., random_state=1)['model']
        
        topic_model = res['topic_model'] 
        doc_classification = res['documents_classification']
        
        print(topic_model)
        print(doc_classification)
        
        table1 = topic_model.values.tolist()
        table2 = doc_classification.values.tolist()
        
        self.assertListEqual(table1[0], ['Topic 0', "['turkey: 2.2501188181821465', 'movie: 2.235788179197627', 'space: 2.168122537253288']"])
        self.assertListEqual(table1[1], ['Topic 1', "['race: 2.950396772740416', 'holiday: 1.352347067212488', 'turkey: 1.318965546493342']"])
        self.assertListEqual(table2[0], ['eat turkey on turkey day holiday', 'Topic 0'])
        self.assertListEqual(table2[1], ['i like to eat cake on holiday', 'Topic 2'])
        
    def test_latent_dirichlet_allocation2(self):
        input_dataframe = self.data
        
        res = lda(table=input_dataframe, input_col='text', num_voca=15, num_topic=2, num_topic_word=2, max_iter=15, learning_method='batch', learning_offset=10., random_state=1)['model']
        
        topic_model = res['topic_model'] 
        doc_classification = res['documents_classification']
        
        print(topic_model)
        print(doc_classification)
        
        table1 = topic_model.values.tolist()
        table2 = doc_classification.values.tolist()
        
        self.assertListEqual(table1[0], ['Topic 0', "['movie: 4.491817807949126', 'space: 2.447628419302112']"])
        self.assertListEqual(table1[1], ['Topic 1', "['turkey: 3.4910071409731676', 'holiday: 3.4881921946742818']"])
        self.assertListEqual(table2[0], ['eat turkey on turkey day holiday', 'Topic 1'])
        self.assertListEqual(table2[1], ['i like to eat cake on holiday', 'Topic 1'])


if __name__ == '__main__':
    unittest.main()
