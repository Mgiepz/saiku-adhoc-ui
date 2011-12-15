JSpec.addMatchers({
  
  be_tag: "jQuery(actual).is(expected) === true",
  
  be_in: { match: function(actual) {
    var possibleExpectations = Array.prototype.slice.call(arguments, 1);
    return JSpec.any(possibleExpectations, function(each){
      return each === actual;
    });
  }},
  
  receive_stub: {defer: true, match: function(actual, method, returnValue, times) {
    JSpec.stub(actual, method).and_return(returnValue)
    var proxy = new JSpec.ProxyAssertion(actual, method, times, this.negate)
    JSpec.currentSpec.assertions.push(proxy)
    return proxy
  }}
  
})
