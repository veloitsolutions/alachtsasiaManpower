import mongoose from 'mongoose';

const clientLogoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClientLogo = mongoose.model('ClientLogo', clientLogoSchema);

export default ClientLogo;
