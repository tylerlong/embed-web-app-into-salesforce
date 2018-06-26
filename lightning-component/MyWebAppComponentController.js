({
  doInit : function(component, event, helper) {
    if(window.receiveMessage !== undefined){
      window.removeEventListener("message", window.receiveMessage);
    }
    window.receiveMessage = function(event) {
      switch(event.data.type) {
        case 'WRITE_CUSTOM_STRING':
          const setAction = component.get("c.setOpportunityCustomString");
          setAction.setParams({
            opportunityId: component.get("v.recordId"),
            customString: event.data.customString
          });
          $A.enqueueAction(setAction);
          console.log('Writing custom string', event.data.customString)
          break
        case 'READ_CUSTOM_STRING':
          const getAction = component.get("c.getOpportunityCustomString");
          getAction.setParams({
            opportunityId: component.get("v.recordId")
          });
          getAction.setCallback(this, function(response) {
            const customString = response.getReturnValue();
            document.getElementById('my-web-app-iframe').contentWindow
              .postMessage({ type: 'CUSTOM_STRING_FROM_SALESFORCE', customString }, '*')
          });
          $A.enqueueAction(getAction);
          console.log('Reading custom string')
          break
        default:
          break
      }
    }
    window.addEventListener("message", receiveMessage);
  }
})
