import add_ from "./add";
import delete_ from "./delete";
import extract_ from "./extract";
import extractFull_ from "./extractFull";
import list_ from "./list";
import test_ from "./test";
import update_ from "./update";

export default class Zip {
	public add = add_;
	public delete = delete_;
	public extract = extract_;
	public extractFull = extractFull_;
	public list = list_;
	public test = test_;
	public update = update_;
}
