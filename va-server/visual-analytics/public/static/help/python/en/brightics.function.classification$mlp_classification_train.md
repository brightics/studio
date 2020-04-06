## Format
### Python
```python
from brightics.function.classification import mlp_classification_train
res = mlp_classification_train(table = ,feature_cols = ,label_col = ,hidden_layer_sizes = ,activation = ,solver = ,alpha = ,batch_size_auto = ,batch_size = ,learning_rate = ,learning_rate_init = ,max_iter = ,random_state = ,tol = ,group_by = )
res['model']
```

## Description
Fit a MLP classification model. MLP is a class of feedforward artificial neural network. A MLP consists of at least three layers of nodes: an input layer, a hidden layer and an output layer. Except for the input nodes, each node is a neuron that uses a nonlinear activation function.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : String, Integer, Long, Double, Float
3. **Hidden Layer Sizes**: The ith element represents the number of neurons in the ith hidden layer
4. **Activation Function**: Activation function for the hidden layer
   - Available items
      - identity
      - logistic
      - tanh
      - relu (default)
5. **Solver**: The solver for weight optimization
   - Available items
      - lbfgs
      - sgd
      - adam (default)
6. **Alpha**: L2 penalty (regularization term) parameter
   - Value type : Double
   - Default : 0.0001 (value >= 0)
7. **Batch Size Auto**: Batch Size Mode
8. **Batch Size**: Size of minibatches for stochastic optimizers
   - Value type : Integer
   - Default : (value > 0)
9. **Learning Rate**: Learning rate schedule for weight updates
   - Available items
      - constant (default)
      - invscaling
      - adaptive
10. **Learning Rate Initial**: The initial learning rate used. Only used when solver=’sgd’ or ‘adam’
    - Value type : Double
    - Default : 0.001 (value > 0)
11. **Max Iteration**: Maximum number of iterations
    - Value type : Integer
    - Default : 200 (value >= 1)
12. **Seed**: The seed used by the random number generator
    - Value type : Integer
13. **Tolerance**: Tolerance for the optimization
    - Value type : Double
    - Default : 0.0001 (value > 0)
14. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : String, Integer, Long, Double, Float
3. **hidden_layer_sizes**: The ith element represents the number of neurons in the ith hidden layer
4. **activation**: Activation function for the hidden layer
   - Available items
      - identity
      - logistic
      - tanh
      - relu (default)
5. **solver**: The solver for weight optimization
   - Available items
      - lbfgs
      - sgd
      - adam (default)
6. **alpha**: L2 penalty (regularization term) parameter
   - Value type : Double
   - Default : 0.0001 (value >= 0)
7. **batch_size_auto**: Batch Size Mode
8. **batch_size**: Size of minibatches for stochastic optimizers
   - Value type : Integer
   - Default : (value > 0)
9. **learning_rate**: Learning rate schedule for weight updates
   - Available items
      - constant (default)
      - invscaling
      - adaptive
10. **learning_rate_init**: The initial learning rate used. Only used when solver=’sgd’ or ‘adam’
    - Value type : Double
    - Default : 0.001 (value > 0)
11. **max_iter**: Maximum number of iterations
    - Value type : Integer
    - Default : 200 (value >= 1)
12. **random_state**: The seed used by the random number generator
    - Value type : Integer
13. **tol**: Tolerance for the optimization
    - Value type : Double
    - Default : 0.0001 (value > 0)
14. **group_by**: Columns to group by

#### Outputs: model

