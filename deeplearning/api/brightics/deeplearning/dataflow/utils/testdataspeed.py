from tqdm import tqdm
from tqdm import trange
import time

def start(df, test_size=5000, warmup=None, print_top_n=0, sleep=None):
    df.reset_state()
    it = df.get_data()

    if warmup:
        for _ in trange(warmup):
            next(it)
       
    with tqdm(total=test_size, leave=True, smoothing=0.2) as pbar:
        for _ in range(test_size):
            if _ < print_top_n:
                dp = next(it)
                print( dp )
            else:
                next(it)
            pbar.update()
            if sleep is not None:
                time.sleep(sleep)
            