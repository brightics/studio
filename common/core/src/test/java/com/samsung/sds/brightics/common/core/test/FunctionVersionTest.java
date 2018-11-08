package com.samsung.sds.brightics.common.core.test;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;

import com.samsung.sds.brightics.common.core.util.FunctionVersion;

public class FunctionVersionTest {

    @Test
    public void couldGetFunctionVersionFromString() {
        FunctionVersion version = FunctionVersion.getVersion("2");
        assertThat(version.major).isEqualTo(2);
        assertThat(version.minor).isEqualTo(0);

        version = FunctionVersion.getVersion("3");
        assertThat(version.major).isEqualTo(3);
        assertThat(version.minor).isEqualTo(0);

        version = FunctionVersion.getVersion("3.3");
        assertThat(version.major).isEqualTo(3);
        assertThat(version.minor).isEqualTo(3);
    }

    @Test
    public void getVersionWithInvalidStringReturnNoVersionInstance() {
        FunctionVersion version = FunctionVersion.getVersion("");

        assertThat(FunctionVersion.NO_VERSION.equals(version)).isTrue();
    }

    @Test
    public void onlyCheckMajorAndMinorVersion() {
        FunctionVersion version = FunctionVersion.getVersion("3.5.0");

        assertThat(version.major).isEqualTo(3);
        assertThat(version.minor).isEqualTo(5);
    }

    @Test
    public void canCheckVersionIsLaterThan() {
        FunctionVersion version = FunctionVersion.getVersion("3.5");

        assertThat(version.isLaterThan("2")).isTrue();
        assertThat(version.isLaterThan("3")).isTrue();
        assertThat(version.isLaterThan("3.5")).isFalse();
        assertThat(version.isLaterThan("3.6")).isFalse();
        assertThat(version.isLaterThan("4.0")).isFalse();
    }

    @Test
    public void canCheckVersionIsPreviousThan() {
        FunctionVersion version = FunctionVersion.getVersion("3.5");

        assertThat(version.isPreviousThan("2")).isFalse();
        assertThat(version.isPreviousThan("3")).isFalse();
        assertThat(version.isPreviousThan("3.5")).isFalse();
        assertThat(version.isPreviousThan("3.6")).isTrue();
        assertThat(version.isPreviousThan("4.0")).isTrue();
    }

    @Test
    public void canCheckVersionIsSameWith() {
        FunctionVersion version = FunctionVersion.getVersion("3.5");

        assertThat(version.isSameWith("2")).isFalse();
        assertThat(version.isSameWith("3")).isFalse();
        assertThat(version.isSameWith("3.5")).isTrue();
        assertThat(version.isSameWith("3.6")).isFalse();
        assertThat(version.isSameWith("4.0")).isFalse();
    }
}
