const { Note } = require("../models");

exports.getNotes = async (req, res) => {
  const { storeId, year, month } = req.params;
  try {
    const notes = await Note.findAll({
      where: { storeId, year, month },
      order: [["createdAt", "ASC"]],
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "메모 조회 실패" });
  }
};

exports.addNote = async (req, res) => {
  const { storeId, year, month, content } = req.body;
  try {
    const newNote = await Note.create({ storeId, year, month, content });
    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "메모 추가 실패" });
  }
};

exports.deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    await Note.destroy({ where: { id: noteId } });
    res.json({ message: "메모 삭제 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "메모 삭제 실패" });
  }
};
