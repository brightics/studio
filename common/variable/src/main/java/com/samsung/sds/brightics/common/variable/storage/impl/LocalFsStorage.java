/*
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
*/

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
