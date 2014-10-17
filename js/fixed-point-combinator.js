function Y(gen) {
  function g(magic) {
      return magic(magic);
  }
  function f(magic) {
      return gen(function(n){ 
        return magic(magic)(n);
      });
  }   
  return g(f);
}

var foo = Y(function(self){
  return function f(n){
    return n < 2 ? 1 : n * self(n-1);
  }
});