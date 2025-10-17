import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    // bio: {
    //   type: String,
    //   required: false,
    //   default: ''
    // },
  },
  {
    timestamps: true,
  }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
