import tensorflow as tf
from tqdm import tqdm
from tqdm import trange

def start(ds, test_size=5000, warmup=None, print_top_n=0):
    it = ds.make_one_shot_iterator()
    next_dp = it.get_next()
    with tf.Session() as sess:
        if warmup:
            for _ in trange(warmup):
                sess.run(next_dp)
           
        with tqdm(total=test_size, leave=True, smoothing=0.2) as pbar:
            for _ in range(test_size):
                if _ < print_top_n:
                    dp = sess.run(next_dp)
                    print( dp )
                else:
                    sess.run(next_dp)
                pbar.update()
                