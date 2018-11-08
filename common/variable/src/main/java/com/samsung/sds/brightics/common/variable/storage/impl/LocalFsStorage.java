package com.samsung.sds.brightics.common.variable.storage.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.samsung.sds.brightics.common.variable.storage.AbstractScriptableStorage;

/**
 * This class backup a scriptable in Local file system.
 * 
 * @author jb.jung
 *
 */
public class LocalFsStorage extends AbstractScriptableStorage {

    private final File pathTo;

    public LocalFsStorage(String path) {
        pathTo = new File(path);
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new FileInputStream(pathTo);
    }

    @Override
    public OutputStream getOutputStream() throws IOException {
        return new FileOutputStream(pathTo);
    }

    @Override
    public void close() {
        // closing is not needed.
    }

}
