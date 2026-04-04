import pool from "../lib/database.js"

// Sidebar — only users with chat history
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const [rows] = await pool.query(`
    SELECT 
        u.id,
        u.name,
        u.profile_pic,
        latest.text AS last_message,
        latest.created_at AS last_message_time,
        COUNT(CASE WHEN m.is_read = FALSE AND m.receiver_id = ? THEN 1 END) AS unread_count
    FROM users u
    INNER JOIN (
        SELECT 
            CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS other_user_id,
            text,
            created_at,
            ROW_NUMBER() OVER (
                PARTITION BY CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
                ORDER BY created_at DESC
            ) AS rn
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
    ) AS latest ON latest.other_user_id = u.id AND latest.rn = 1
    LEFT JOIN messages m ON (
        (m.sender_id = ? AND m.receiver_id = u.id) OR
        (m.sender_id = u.id AND m.receiver_id = ?)
    ) AND m.is_read = FALSE AND m.receiver_id = ?
    WHERE u.id != ?
    GROUP BY u.id, u.name, u.profile_pic, latest.text, latest.created_at
    ORDER BY latest.created_at DESC
`, [
    loggedInUserId,
    loggedInUserId, loggedInUserId,
    loggedInUserId, loggedInUserId,
    loggedInUserId, loggedInUserId, loggedInUserId,
    loggedInUserId
]);

        res.json(rows);
    } catch (error) {
        console.error('Failed to fetch sidebar users:', error);
        res.status(500).json({ error: 'Failed to fetch sidebar users' });
    }
};

// Search users by name or email — excludes self
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query; // /messages/search?query=alice
        const loggedInUserId = req.user.id;

        if (!query || query.trim() === "") {
            return res.status(400).json({ error: "Search query is required" });
        }

        const [rows] = await pool.query(`
            SELECT id, name, email, profile_pic
            FROM users
            WHERE id != ?
              AND (name LIKE ? OR email LIKE ?)
            LIMIT 10
        `, [loggedInUserId, `%${query}%`, `%${query}%`]);

        res.json(rows);
    } catch (error) {
        console.error('Failed to search users:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
};

// Get messages between two users
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user.id;

        const [rows] = await pool.query(`
            SELECT 
                m.id, 
                m.text, 
                m.image,
                m.is_read,
                m.created_at, 
                (CASE WHEN m.sender_id = ? THEN 'me' ELSE 'them' END) AS sender
            FROM messages m
            WHERE (m.sender_id = ? AND m.receiver_id = ?) 
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.created_at ASC
        `, [myId, myId, userToChatId, userToChatId, myId]);

        // Mark messages as read
        await pool.query(`
            UPDATE messages SET is_read = TRUE
            WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE
        `, [userToChatId, myId]);

        res.json(rows);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiver_id } = req.params;
        const sender_id = req.user.id;

        if (!text && !image) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        const [result] = await pool.query(`
            INSERT INTO messages (text, image, sender_id, receiver_id) 
            VALUES (?, ?, ?, ?)
        `, [text || null, image || null, sender_id, receiver_id]);

        res.status(201).json({ 
            message: 'Message sent successfully', 
            messageId: result.insertId 
        });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};