'use client'
import Igniter from './components/home/igniter/Igniter';

export default function Home() {

  /**
   curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"conversation_id": null, "message": "Hello!"}'
   */
  const handleSendMessage = (message: string) => {
    console.log(message);
    fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        conversation_id: null
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response from server:', data);
      // redirect to chat/[data.conversation_id]
      window.location.href = `/chat/${data.conversation_id}`;
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });


    
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Igniter sendMessage={handleSendMessage} />
      </main>
    </div>
  );
}
