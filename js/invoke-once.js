/**
 * ����f��time�������ڣ�ʱ���ڣ����۵��ö��٣�ʵ��ֻ��ִ��һ��
 */
function once(f, time){
    var lastTime;
    var T = time || 100;
    var lastResult;
    
    return function(){
        var isFirst = (lastTime == null);
        var isTimeout = isFirst || (new Date().getTime() - lastTime > T);
        
        if(isTimeout){
            lastTime = new Date().getTime();
            lastResult = f.apply(this, arguments);
        }
        return lastResult;
    };
}

function foo(s){
   return s * 10;
}

var f = once(foo, 500);

f(1); //return 10
f(2); //return 10 !