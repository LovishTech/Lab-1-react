import { useEffect } from "react";

const KommunicateChat = ({ fullPage = false }) => {
  useEffect(() => {
    (function(d, m){
      var kommunicateSettings = {
        "appId":"17419d6ffc11f8c3cdd3150cc7e8667e8",
        "popupWidget": !fullPage,
        "automaticChatOpenOnNavigation": fullPage
      };
      
      if (window.kommunicate) {
        // If Kommunicate is already loaded, update settings
        window.kommunicate._globals = {...window.kommunicate._globals, ...kommunicateSettings};
        
        if (fullPage) {
          // Launch chat in full page mode
          window.kommunicate.launchConversation();
        }
      } else {
        // First time loading Kommunicate
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        window.kommunicate = m;
        m._globals = kommunicateSettings;
      }
    })(document, window.kommunicate || {});
  }, [fullPage]);

  // Add a container div for full page mode
  return fullPage ? (
    <div className="fullpage-chat-container" style={{ 
      minHeight: "500px", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      {/* The chat will be loaded here */}
    </div>
  ) : null;
};

export default KommunicateChat;