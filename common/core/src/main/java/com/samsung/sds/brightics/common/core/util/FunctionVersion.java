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

package com.samsung.sds.brightics.common.core.util;

import org.apache.commons.lang3.StringUtils;

public class FunctionVersion {

    public static final FunctionVersion NO_VERSION = new FunctionVersion(0, 0);

    public final int major;
    public final int minor;

    private FunctionVersion(int major, int minor) {
        this.major = major;
        this.minor = minor;
    }

    public static FunctionVersion getVersion(String version) {
        return parseVersionString(version);
    }

    public boolean isPreviousThan(String target) {
        FunctionVersion targetVersion = parseVersionString(target);
        return isPreviousThan(targetVersion);
    }

    public boolean isPreviousThan(FunctionVersion target) {
        if (this.major < target.major) return true;
        if (this.major == target.major && this.minor < target.minor) return true;

        return false;
    }

    public boolean isSameWith(String target) {
        FunctionVersion targetVersion = parseVersionString(target);
        return isSameWith(targetVersion);
    }

    public boolean isSameWith(FunctionVersion target) {
        return this.major == target.major && this.minor == target.minor;
    }

    public boolean isLaterThan(String target) {
        FunctionVersion targetVersion = parseVersionString(target);
        return isLaterThan(targetVersion);
    }

    public boolean isLaterThan(FunctionVersion target) {
        if (this.major > target.major) return true;
        if (this.major == target.major && this.minor > target.minor) return true;

        return false;
    }

    private static FunctionVersion parseVersionString(String version) {
        String[] versionSplit = StringUtils.split(version, ".");

        try {
            int major = Integer.parseInt(versionSplit[0]);
            int minor = versionSplit.length > 1 ? Integer.parseInt(versionSplit[1]) : 0;
            return new FunctionVersion(major, minor);
        } catch (Exception e) {
            return NO_VERSION;
        }
    }

    @Override
    public String toString() {
        return "FunctionVersion [Major: " + this.major + ", Minor: " + this.minor + "]";
    }
}
