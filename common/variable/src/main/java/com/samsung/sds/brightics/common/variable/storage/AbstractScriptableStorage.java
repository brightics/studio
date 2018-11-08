package com.samsung.sds.brightics.common.variable.storage;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

/**
 * This abstract class is superclass of storage classes
 * which read and write Scriptable object from each type of storage.
 *
 * @author jb.jung
 */
public abstract class AbstractScriptableStorage {

	/**
	 * Inputstream to read scriptable(scope) object.
	 *
	 * @return inputstream
	 */
	protected abstract InputStream getInputStream() throws IOException;

	/**
	 * Create or read scriptable. It first tries to read from inputstream but create new scriptable if reading job is failed.
	 *
	 * @return Scriptable instance.
	 */
	public Scriptable getScriptable() {
		try (ObjectInputStream in = new ObjectInputStream(getInputStream())) {
			return (Scriptable) in.readObject();
		} catch (Exception e) {
			Context cx = Context.enter();
			Scriptable scope = cx.initStandardObjects();
			Context.exit();

			return scope;
		}
	}

	/**
	 * Outputstream to write backup of scope associated with this storage.
	 *
	 * @return inputstream
	 */
	protected abstract OutputStream getOutputStream() throws IOException;

	public void writeScriptable(Scriptable scope) throws IOException {
		try (ObjectOutputStream out = new ObjectOutputStream(new BufferedOutputStream(getOutputStream()))) {
			out.writeObject(scope);
		}
	}

	/**
	 * Close this storage.
	 */
	public abstract void close();
}
