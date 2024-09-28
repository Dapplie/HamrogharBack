const jwt = require('jsonwebtoken');
const Property = require('../models/RealEstate');
const { ObjectId } = require('mongoose').Types;
const User = require('../models/Auth');
const nodemailer = require('nodemailer');

const BookNow = require('../models/BookNow');
const owner_rejection = async (req, res) => {
  const { _id } = req.body;

  try {
    const result = await BookNow.deleteOne({ _id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
const admin_deactivate_reviewAuth_to_false = async (req, res) => {
  try {
    const { _id } = req.body;

    // Find the document by _id and switch the reviewAuth value
    const bookNowEntry = await BookNow.findById(_id);

    if (!bookNowEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Switch the reviewAuth boolean value
    bookNowEntry.reviewAuth = !bookNowEntry.reviewAuth;

    // Save the updated document
    await bookNowEntry.save();

    return res.status(200).json({ message: 'Review authorization updated successfully', bookNowEntry });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}
const get_admin_review_text_reviewAuth_true = async (req, res) => {
  try {
    const reviews = await BookNow.find({ reviewAuth: true }, { tenantId: 1, propertyId: 1, ownerId: 1, _id: 1, rating: 1, reviewText: 1 });

    const tenantIds = reviews.map(review => review.tenantId);

    const tenants = await User.find({ _id: { $in: tenantIds } }, { name: 1 });

    const result = reviews.map(review => {
        const tenant = tenants.find(tenant => tenant._id.toString() === review.tenantId.toString());
        return {
            tenantId: review.tenantId,
            name: tenant ? tenant.name : 'Unknown',
            propertyId: review.propertyId,
            ownerId: review.ownerId,
            _id: review._id,
            rating: review.rating,
            reviewText: review.reviewText
        };
    });

    res.status(200).json(result);
} catch (error) {
    res.status(500).json({ message: error.message });
}
}
const get_review_text_reviewAuth_true = async (req, res) => {
  const { _id } = req.body;

  try {
      const reviews = await BookNow.find({ propertyId: _id, reviewAuth: true }, { tenantId: 1, propertyId: 1, ownerId: 1, _id: 1, rating: 1, reviewText: 1 });

      const tenantIds = reviews.map(review => review.tenantId);

      const tenants = await User.find({ _id: { $in: tenantIds } }, { name: 1 });

      const result = reviews.map(review => {
          const tenant = tenants.find(tenant => tenant._id.toString() === review.tenantId.toString());
          return {
              tenantId: review.tenantId,
              name: tenant ? tenant.name : 'Unknown',
              propertyId: review.propertyId,
              ownerId: review.ownerId,
              _id: review._id,
              rating: review.rating,
              reviewText: review.reviewText
          };
      });

      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }

}


const set_review_text = async (req, res) => {
  const { _id, reviewText, reviewAuth } = req.body;

  console.log(req.body);
  if (!_id || !reviewText) {
    return res.status(400).send("Both _id and reviewText are required.");
  }

  try {
    const updatedRecord = await BookNow.findByIdAndUpdate(
      _id,
      { reviewText, reviewAuth },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).send("Record not found.");
    }

    res.send(updatedRecord);
  } catch (error) {
    res.status(500).send("Error updating record: " + error.message);
  }
}


const set_rating = async (req, res) => {
  const { _id, rating } = req.body;

  try {
    const updatedBooking = await BookNow.findByIdAndUpdate(
      _id,
      { $set: { rating: parseInt(rating) } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const update_paid_status = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ error: "Missing '_id' in request body" });
    }

    const updatedRecord = await BookNow.findByIdAndUpdate(
      _id,
      { paid: true },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Paid status updated successfully', updatedRecord });
  } catch (error) {
    console.error('Error updating paid status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const set_fracture_details = async (req, res) => {
  try {
      const { _id, startDate, endDate, amount, methodOfPayment, comments, paymentsDue } = req.body;
      
      if (!_id) {
          return res.status(400).json({ error: "Missing _id in the request body" });
      }

      const updateData = {
          startDate,
          endDate,
          amount,
          methodOfPayment,
          comments,
          paymentsDue
      };

      const updatedRecord = await BookNow.findByIdAndUpdate(_id, updateData, { new: true });

      if (!updatedRecord) {
          return res.status(404).json({ error: "Record not found" });
      }
console.log("updated succesfully");
      res.status(200).json({ message: "Record updated successfully", data: updatedRecord });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};



const owner_confirmation = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Invalid _id' });
    }

    const booking = await BookNow.findByIdAndUpdate(_id, { ownerConfirmation: true }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Retrieve propertyId from the booking
    const propertyId = booking.propertyId;
    if (!propertyId) {
      return res.status(400).json({ message: 'PropertyId not found in booking' });
    }

    // Retrieve the property name from the Property table
    const property = await Property.findOne({ _id: new ObjectId(propertyId) });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const propertyName = property.name;

    // Send email to tenantEmail
    const tenantEmail = booking.tenantEmail;
    if (tenantEmail) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dollarrami75@gmail.com',
          pass: 'tdco ogya momt kdee'
        }
      });

      const mailOptions = {
        from: 'dollarrami75@gmail.com',
        to: tenantEmail,
        subject: 'Booking Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <table width="100%" style="max-width: 600px; margin: auto; border-collapse: collapse; background-color: #f4f4f9;">
              <tr>
                <td style="background-color: #4a90e2; padding: 20px; text-align: center; color: #fff;">
                  <h1 style="margin: 0; font-size: 24px;">Booking Confirmation</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <h2 style="margin-top: 0;">Hello,</h2>
                  <p style="font-size: 18px; line-height: 1.5;">
                    We are thrilled to inform you that your booking for the property 
                    <strong style="color: #4a90e2;">${propertyName}</strong> has been 
                    <span style="color: #28a745;">confirmed</span> by the owner.
                  </p>
                  <p style="font-size: 18px; line-height: 1.5;">
                    Please prepare for your upcoming stay and do not hesitate to reach out if you have any questions or need further assistance.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f4f4f9; padding: 20px; text-align: center; color: #aaa;">
                  <p style="margin: 0; font-size: 14px;">Thank you for choosing our service!</p>
                  <p style="margin: 0; font-size: 14px;">&copy; 2024 HARMOGHAR. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    // Retrieve ownerId from the booking
    const ownerId = booking.ownerId;
    if (!ownerId) {
      return res.status(400).json({ message: 'OwnerId not found in booking' });
    }

    // Retrieve the owner's email from the User table
    const owner = await User.findOne({ _id: new ObjectId(ownerId) });
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    const ownerEmail = owner.email;

    // Send email to ownerEmail
    if (ownerEmail) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dollarrami75@gmail.com',
          pass: 'tdco ogya momt kdee'
        }
      });

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: ownerEmail,
        subject: 'Booking Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <table width="100%" style="max-width: 600px; margin: auto; border-collapse: collapse; background-color: #f4f4f9;">
              <tr>
                <td style="background-color: #4a90e2; padding: 20px; text-align: center; color: #fff;">
                  <h1 style="margin: 0; font-size: 24px;">Booking Confirmation</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <h2 style="margin-top: 0;">Hello,</h2>
                  <p style="font-size: 18px; line-height: 1.5;">
                    Your confirmation for the booking of the property 
                    <strong style="color: #4a90e2;">${propertyName}</strong> has been successfully 
                    completed.
                  </p>
                  <p style="font-size: 18px; line-height: 1.5;">
                    Thank you for using our service and confirming the booking.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f4f4f9; padding: 20px; text-align: center; color: #aaa;">
                  <p style="margin: 0; font-size: 14px;">Thank you for choosing our service!</p>
                  <p style="margin: 0; font-size: 14px;">&copy; 2024 HARMOGHAR. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    res.status(200).json({ message: 'Owner confirmation updated successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  };
// get_confirmed_booking
// specific 1222222222222222222222222222222222222222222222222222222222
const get_non_confirmed_booking = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, 'youtube');
    const userId = decoded.userId;

    const bookings = await BookNow.find({ ownerConfirmation: false });
    const filteredBookings = bookings.filter(booking => booking.ownerId === userId || booking.tenantId === userId);

    const bookingsWithProperty = await Promise.all(
      filteredBookings.map(async booking => {
        const property = await Property.findById(booking.propertyId).select('name image');
        return { ...booking.toObject(), property: property ? { ...property.toObject(), _id: property._id.toString() } : null };
      })
    );

    res.status(200).json(bookingsWithProperty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

  // specific 123
  const get_confirmed_booking = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'youtube');
        const userId = decoded.userId;

        const bookings = await BookNow.find({ ownerConfirmation: true });
        const bookingsWithProperty = await Promise.all(
            bookings.map(async booking => {
                const property = await Property.findById(booking.propertyId).select('name image');
                return { ...booking.toObject(), property: property ? { ...property.toObject(), _id: property._id.toString() } : null };
            })
        );

        const userBookings = bookingsWithProperty.filter(booking => booking.ownerId === userId || booking.tenantId === userId);

        res.status(200).json(userBookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


// udate update udate update udate update udate update udate update udate update udate update
const add_book_now = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'youtube');
  const { userId } = decoded;

  const { userId: ownerId, _id: propertyId, startDate, endDate, ownerConfirmation, paid, rating, received, reminder, dueReminder, paymentsDue, reviewText, reviewAuth } = req.body;

  try {
    // Check if booking already exists for the same tenantId, propertyId, and overlapping dates
    const existingBooking = await BookNow.findOne({
      tenantId: userId,
      propertyId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Booking conflicts with existing booking' });
    }

    const existingBookingFromOthers = await BookNow.findOne({
      propertyId,
      ownerConfirmation:true,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    // Check if owner has confirmed the booking and dates overlap with current time
    if (existingBookingFromOthers) {
      return res.status(400).json({ message: 'Booking cannot be added as owner has confirmed for these dates' });
    }

    // Fetch user details
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const booking = new BookNow({
      tenantId: userId,
      ownerId,
      propertyId,
      startDate,
      endDate,
      ownerConfirmation,
      paid,
      rating,
      received,
      reminder,
      dueReminder,
      paymentsDue,
      reviewText,
      reviewAuth,
      tenantEmail: user.email,
      tenantFullName: user.name,
      tenantMobileNum: user.phone
    });

    await booking.save();

    res.status(201).json({ message: 'Booking saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save booking', error: err.message });
  }
};



module.exports = {
    add_book_now,owner_rejection, admin_deactivate_reviewAuth_to_false, get_review_text_reviewAuth_true,get_admin_review_text_reviewAuth_true, get_non_confirmed_booking,set_review_text, owner_confirmation, get_confirmed_booking, set_fracture_details, update_paid_status, set_rating
};
