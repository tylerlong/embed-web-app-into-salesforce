({
  doInit : function(component, event, helper) {
      let action = component.get("c.getOpportunityGlipGroupId");
      action.setParams({
          opportunityId: component.get("v.recordId")
      });
      action.setCallback(this, function(response) {
          let glipGroupId = response.getReturnValue();
          component.set("v.glipGroupId", glipGroupId);
      });
      $A.enqueueAction(action);
      
      if(window.receiveMessage !== undefined){
          window.removeEventListener("message", window.receiveMessage);
      }
      window.receiveMessage = function(event) {
          if(event.data.type === 'WRITE_CUSTOM_STRING') {
              let action = component.get("c.setOpportunityCustomString");
              action.setParams({
                  opportunityId: component.get("v.recordId"),
                  customString: event.data.customString
              });
              $A.enqueueAction(action);
              console.log('Saving custom string', event.data.customString)
          }
      }
      window.addEventListener("message", receiveMessage);
  }
})
