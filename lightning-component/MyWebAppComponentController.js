({
  doInit : function(component, event, helper) {
    if(window.receiveMessage !== undefined){
      window.removeEventListener("message", window.receiveMessage);
    }
    window.receiveMessage = function(event) {
      switch(event.data.type) {
        case 'WRITE_CUSTOM_STRING':
          const action = component.get("c.setOpportunityCustomString");
          action.setParams({
            opportunityId: component.get("v.recordId"),
            customString: event.data.customString
          });
          $A.enqueueAction(action);
          console.log('Writing custom string', event.data.customString)
          break
        case 'READ_CUSTOM_STRING':
          const action = component.get("c.getOpportunityCustomString");
          action.setParams({
            opportunityId: component.get("v.recordId")
          });
          action.setCallback(this, function(response) {
            const customString = response.getReturnValue();
            document.getElementById('my-web-app-iframe').contentWindow
              .postMessage({ type: 'CUSTOM_STRING_FROM_SALESFORCE', customString }, '*')
          });
          $A.enqueueAction(action);
          console.log('Reading custom string', event.data.customString)
          break
        default:
          break
      }
    }
    window.addEventListener("message", receiveMessage);
  }
})
