using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        // Message privé
        public async Task SendPrivateMessage(string toUserId, string message)
        {
            var fromUser = Context.UserIdentifier;

            // Envoi uniquement à l'utilisateur ciblé
            await Clients.User(toUserId).SendAsync("ReceivePrivateMessage", fromUser, message);

            // Optionnel : feedback à l'expéditeur
            await Clients.Caller.SendAsync("PrivateMessageSent", toUserId, message);
        }
    }
}
