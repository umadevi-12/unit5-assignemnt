const Member = require("../models/Member");


exports.addMember = async (req, res) => {
    try {
        const { name, email } = req.body;
        const member = await Member.create({ name, email });
        res.status(201).json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getMemberBorrowedBooks = async (req, res) => {
    try {
        const member = await Member.findById(req.params.memberId).populate("borrowedBooks", "title author status");
        res.json(member.borrowedBooks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
