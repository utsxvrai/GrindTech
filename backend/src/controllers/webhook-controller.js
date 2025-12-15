const { Webhook } = require('svix');
const prisma = require('../config/db-config');
require('dotenv').config();

const handleClerkWebhook = async (req, res) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error('Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error: Missing svix headers' });
  }

  // Get body
  const body = req.rawBody;

  let evt;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error: Could not verify webhook:', err.message);
    return res.status(400).json({ error: 'Verification failed' });
  }

  const eventType = evt.type;
  const { id, email_addresses, username, first_name, last_name } = evt.data;

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);

  try {
    if (eventType === 'user.created') {
      const email = email_addresses[0]?.email_address;
      // Build full name from firstName and lastName, or fall back to username
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || username || email?.split('@')[0] || 'User';

      await prisma.user.create({
        data: {
          clerkId: id,
          useremail: email,
          username: fullName,
          plan: 'free', // Default plan
        },
      });
      console.log(`User created: ${id} with name: ${fullName}`);
    } else if (eventType === 'user.updated') {
      const email = email_addresses[0]?.email_address;
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || username || undefined;

      await prisma.user.update({
        where: { clerkId: id },
        data: {
          useremail: email,
          username: fullName || undefined,
        },
      });
      console.log(`User updated: ${id} with name: ${fullName}`);
    } else if (eventType === 'user.deleted') {
      await prisma.user.delete({
        where: { clerkId: id },
      });
      console.log(`User deleted: ${id}`);
    }

    return res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
};

module.exports = { handleClerkWebhook };
