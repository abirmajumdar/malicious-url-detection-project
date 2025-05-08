const deleteUrlSearch=async(req,res)=>{
    try {
        const { id } = req.params;
        await User.updateOne(
          { 'searches._id': id },
          { $pull: { searches: { _id: id } } }
        );
        res.status(200).json({ message: 'Deleted Successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
}
module.exports = deleteUrlSearch