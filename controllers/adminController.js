const Seller = require('../models/Seller');

const updateSellerStatus = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status } = req.body; 

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    seller.status = status;
    await seller.save();

    res.status(200).json({
      message: `Seller request ${status} successfully`,
      seller,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const getPendingSellers = async (req, res) => {
  try {
    const { status } = req.query;

    if (status !== 'pending') {
      return res.status(400).json({ message: 'Invalid status query parameter' });
    }
    const pendingSellers = await Seller.find({ status: 'pending' });

    res.status(200).json(pendingSellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports ={ updateSellerStatus,getPendingSellers};