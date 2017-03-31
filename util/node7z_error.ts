export class Node7zError extends Error{
    constructor(err:Error,public code?:number){
        super(err.message);
        this.name = err.name;
        this.stack = err.stack;
    }
}