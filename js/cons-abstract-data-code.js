// cons:(consist) 组合/组成


function cons(h, t){
    function dispatch(op){
        if(op == 'head'){
            return h;
        }
        if(op == 'tail'){
            return t;
        }
    }
    return dispatch;
}

function head(s){
    return s('head');
}

function tail(s){
    return s('tail');
}

var data = cons('a', 'b');
head(data); // 'a'
tail(data); // 'b';

var data = cons('a', cons('b', cons('c', cons('d'))));
head(data); // 'a'
head(tail(data)); // 'b'
head(tail(tail(data))); // 'c'


function first(s){
    return head(s);
}
function second(s){
    return head(tail(s));
}
function third(s){
    return head(tail(tail(s)));
}

var data = cons('a', cons('b', cons('c', cons('d'))));
first(data); // 'a'
second(data); // 'b'
third(data); // 'c'

function get(s, index){
    function g(s, n){
        if(n == index){
            return head(s); 
        }
        return g(tail(s), n+1);
    }
    return g(s, 0);
}

var data = cons('a', cons('b', cons('c', cons('d'))));
get(data, 0); // 'a'
get(data, 2); // 'c'

function count(s){
    function g(s, n){
        if(s == null) return n;
        return g(tail(s), n+1);
    }
    return g(s, 0);
}
function last(s){
    return get(s, count(s) - 1);
}

var data = cons('a', cons('b', cons('c', cons('d'))));
count(data); // 4
last(data); // 'd'


function list(){
    if(arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 0);
    var head = args.shift();
    return cons(head, list.apply(null, args));
}

var data = list('a', 'b', 'c', 'd'); //cons('a', cons('b', cons('c', cons('d'))));
first(data); // 'a'
second(data); // 'b'
third(data); // 'c'
get(data, 3); // 'd'
count(data); // 4


function forEach(s, f){
    if(s == null) return null;
    f(head(s));
    return forEach(tail(s), f);
}

function map(s, f){
    if(s == null) return null;
    return cons(f(head(s)), map(tail(s), f));
}

function cons(a, b){
    function dispatch(op){
        if(op == 'head'){
            return a;
        }
        if(op == 'tail'){
            return b;
        }
    }
    dispatch.get = function(index){
        return get(this, index);
    };
    dispatch.size = function(){
        return count(this);
    };
    dispatch.forEach = function(f){
        return forEach(this, f);
    };
    dispatch.map = function(f){
        return map(this, f);
    };
    dispatch.last = function(){
        return last(this);
    };
    return dispatch;
}

var data = list('a', 'b', 'c', 'd');
data.size(); // 4
data.get(1); // 'b'
head(data); // 'a'
second(data); // 'b'

var newData = data.map(function(d){ 
	return '<li>' + d + '</li>';
});
newData.get(2); // '<li>c</li>'
newData.last(); // '<li>d</li>'

newData.forEach(function(data){ 
	console.log(data);
});
/*
<li>a</li>
<li>b</li>
<li>c</li>
<li>d</li>
*/