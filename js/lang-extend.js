
Function.prototype.meta = function(metaName){
    var s = this.toString();
    var startIndex = s.indexOf('/*@'+ metaName) + '/*@'+ metaName.length;
    var endIndex = s.indexOf('*/');
    return s.substring(startIndex, endIndex);
};

Function.prototype.argumentNames = function(){
    if(this._argumentNames == null){
        var names = this.toString().match(/function\s*\w*\((.*)\)/);
        if(names.length > 1){
            this._argumentNames = names[1].split(',').map(function(e){return e.trim();});
        }else{
            this._argumentNames = [];
        }
    }
    return this._argumentNames;
}
Function.prototype.argumentTypes = function(){
    if(this._argumentTypes == null){
        var types = this.toString().match(/function\s*\w*\(.*\)\s*\/\*(.*)\*\//);
        if(types.length > 1){
            this._argumentTypes = types[1].split(',').map(function(e){return e.trim();});
        }else{
            this._argumentTypes = [];
        }
    }
    return this._argumentTypes;
}
Function.prototype.typeCheck = function(){
    var self = this;
    var argumentNames = self.argumentNames();
    var argumentTypes = self.argumentTypes();
    return function(){
        
        for(var i=0; i<arguments.length; i++){
            if(typeof arguments[i] != argumentTypes[i]){
                throw new Error('Wrong argument types[ name:' + argumentNames[i] 
                    + ' type:'  + argumentTypes[i] 
                    + ' but:' + (typeof arguments[i]) + ']');
            }
        }
        return self.apply(null, arguments);
    };
};

Function.prototype.argsValid = function(){
    var self = this;
    var argumentNames = self.argumentNames();
    var argumentTypes = self.argumentTypes();
    return function(){
        for(var i=0; i<arguments.length; i++){
            if(argumentTypes[i] == null) continue;
            var reg = new  RegExp(argumentTypes[i]);
            if(reg.test(arguments[i]) == false){
                if(typeof arguments[i] != argumentTypes[i]){
                    throw new Error('Invalid argument:' + argumentNames[i] + '=' + arguments[i]); 
                }
            }
        }
        return self.apply(null, arguments);
    };
};

function polymorphism(){
    var typeMap = {};
    for(var i=0; i<arguments.length; i++){
        var f = arguments[i];
        var argumentTypes = f.argumentTypes();
        typeMap[argumentTypes.join(',')] = f;
    }

    return function(){
        var argumentTypes = [];
        for(var i=0; i<arguments.length; i++){
            argumentTypes.push(typeof arguments[i]);
        }
        var f = typeMap[argumentTypes.join(',')];
        return f.apply(null, arguments);
    };
}

Function.prototype.polymorphism = function(f){
    if(this._polymorphisms == null){
        this._polymorphisms = {};
        this.polymorphism(this);
    }
    var polymorphisms = this._polymorphisms;
    var argumentTypes = f.argumentTypes();
    polymorphisms[argumentTypes.join(',')] = f;
    
    return function(){
        var argumentTypes = [];
        for(var i=0; i<arguments.length; i++){
            argumentTypes.push(typeof arguments[i]);
        }
        var f = polymorphisms[argumentTypes.join(',')];
        return f.apply(null, arguments);
    };
};




function bar(id, name)
{
        
}

function bar(id /*@number*/, email /*@string*/){
}


// 增加类型校验
var bar = bar.typeCheck();

bar(1, 'jack'); // fine

bar(1, 2); // Error: Wrong argument types


function foo(id , email)/*\d+, \S+@\S+.\w+*/{
}

// 参数校验
foo = foo.argsValid();

foo(1, "jack@gmail.com"); // fine
foo(1, "jack.com"); //Error: Invalid argument:email=jack.com


// 定义一个函数
function foo(msg){//@param(\d+,id)
    console.log("number:"+ msg);
};

// 增加多态特性
foo = foo.polymorphism(function(msg)/*string*/{
    console.log("string:" + msg);
});

// 增加多态特性
foo = foo.polymorphism(function(msg, id)/*string,number*/{
    console.log("msg:" + msg + " id:" + id);
});

foo(1); // number:1
foo('1'); // string:1
foo('hello', 1); // msg:hello id:1


var myprint = polymorphism(
    function(msg)/*number*/
    {
        console.log("number:"+ msg);
    },
    function(msg)/*string*/
    {
        console.log("string:" + msg);
    },
    function(id, msg)/*number,string*/
    {
        console.log("id:"+ id + 'string:' + msg);
    }
);

myprint(1);
myprint("1");
myprint(123, "hello");

Rest.get('/user')