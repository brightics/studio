import os
import shutil
import requests
import sys
import zipfile
import pathlib


def main(argv):
    if argv[1] == 'd':
        download_patch()
    if argv[1] == 'cu':
        check_update()


def create_path(path):
    if not os.path.exists(path):
        os.makedirs(path)
    return path


def check_update():
    url = 'https://www.brightics.ai/static/release/update.txt'
    update_path = 'visual-analytics/public/update.txt'
    path = os.path.join(pathlib.Path().absolute(), update_path)
    try:
        with requests.get(url, stream=True) as req:
            server_version = int(req.text)
    except:
        return sys.exit('no')

    f = open(path, 'r')
    local_version = int(f.readline())
    f.close()

    if server_version > local_version:
        print('ua')
    else:
        print('nu')


def download_patch(type='ML'):
    if (type == 'ML'):
        url = 'https://www.brightics.ai/static/release/BrighticsStudio-windows-patch.exe'
        with requests.get(url, stream=True) as req:
            total_length = req.headers.get('content-length')
            path = create_path('./tmp')
            tmp_file = os.path.join(path, 'patch.zip')

            with open(tmp_file, 'wb') as out_file:
                if total_length is None: # no content length header
                    shutil.copyfileobj(req.raw, out_file)
                else:
                    dl = 0
                    total_length = int(total_length)
                    for data in req.iter_content(chunk_size=4096):
                        dl += len(data)
                        out_file.write(data)
                        done = int(50 * dl / total_length)
                        sys.stdout.write("\r[%s%s] %s%s Downloading..." % ('=' * done, ' ' * (50-done), int(dl / total_length * 100), '%'))
                        sys.stdout.flush()
                    out_file.close()
                    apply_patch(path, tmp_file)


def apply_patch(path, filename):
    path = os.path.join(pathlib.Path().absolute(), path)
    tmp_file = os.path.join(path, 'patch.zip')
    tmp_zip = zipfile.ZipFile(tmp_file)
    try:
        tmp_zip.extractall(os.path.join(pathlib.Path().absolute(), '../'))
    except:
        return sys.exit(1)
    finally:
        tmp_zip.close()

    return sys.exit(0)


if __name__ == '__main__':
    main(sys.argv)
