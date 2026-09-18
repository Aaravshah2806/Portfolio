import { useState, useEffect } from 'react';
import ChatPanel from './ChatPanel';
import './AiAssistant.css';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('idle');

  // Random action loop to make the mascot feel alive
  useEffect(() => {
    if (isOpen) return; // Pause random actions if chat is open

    const actions = ['idle', 'idle', 'wiggle', 'jump', 'look'];
    const interval = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setAction(randomAction);
      
      // Reset back to idle after the animation duration (around 1s)
      if (randomAction !== 'idle') {
        setTimeout(() => setAction('idle'), 1000);
      }
    }, 3500); // Trigger a random action every 3.5 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const toggleChat = () => {
    if (!isOpen) {
      // Do a little jump when opening
      setAction('jump');
      setTimeout(() => {
        setIsOpen(true);
      }, 300);
    } else {
      setIsOpen(false);
      setAction('idle');
    }
  };

  return (
    <div className="ai-assistant-container">
      <div 
        className={`mascot-trigger ${isOpen ? 'active' : ''} action-${action}`} 
        onClick={toggleChat}
        onMouseEnter={() => !isOpen && setAction('wiggle')}
      >
        <img
          src="/images/pixel_image-removebg-preview.webp"
          alt="Interactive Mascot"
          className="mascot-img"
          loading="lazy"
          decoding="async"
        />
      </div>
      
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default AiAssistant;
