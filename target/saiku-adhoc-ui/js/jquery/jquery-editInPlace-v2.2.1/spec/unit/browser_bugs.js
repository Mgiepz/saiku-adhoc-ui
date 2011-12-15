// all of these should execute in all browsers if at all possible, to make sure none of them gets 
// bugged out due to the added behaviour.
describe 'browser specific behaviour'
    
  should_behave_like('shared setup')
  
  it "should send other in place editors blur event when the new one gets focus"
    // cold need to encapsulate in div
    this.sandbox = $('<div><p/><p/></div>')
    this.sandbox.find('p').editInPlace({url:'fnord'})
    // open both editors at the same time
    this.sandbox.find('p:first').click()
    this.sandbox.find('p:last').click()
    this.sandbox.find(':input').should.have_length 1
    this.sandbox.should.have_tag 'p:last :input'
  end
  
  it "ie and firefox do not commit a form if it contains no button"
    var enter = 13
    this.openEditor().trigger({ type: 'keyup', which:enter })
    this.sandbox.should.not.have_tag 'form'
  end
  
  it 'webkit nightlies should commit on enter'
    var enter = 13
    this.openEditor().val('fnord').trigger({ type:'keyup', which:enter})
    this.sandbox.should.not.have_tag 'form'
    this.sandbox.should.have_text 'fnord'
  end
  
end
