import mongoose from "mongoose";

export interface CustomerDocument extends mongoose.Document {
  Email: string;
  Company?: string;
  FirstName: string;
  LastName: string;
  Address?: string;
  City?: string;
  State?: string;
  Country?: string;
  PostalCode?: string;
  Phone?: string;
  Fax?: string;
  SupportRepId: mongoose.Types.ObjectId;
}

export interface CustomerModelType extends mongoose.Model<CustomerDocument> {
  getAllCustomers(employeeId: mongoose.Types.ObjectId, isManager: boolean): Promise<CustomerDocument[]>;
}

const customerSchema = new mongoose.Schema<CustomerDocument, CustomerModelType>(
  {
    Email: { type: String, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    SupportRepId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Self-referencing for manager hierarchy
    Address: { type: String, default: "" },
    City: { type: String, default: "" },
    State: { type: String, default: "" },
    Country: { type: String, default: "" },
    PostalCode: { type: String, default: "" },
    Phone: { type: String, default: "" },
    Fax: { type: String, default: "" }
  }
);

// Static method to fetch customers
customerSchema.statics.getAllCustomers = function (employeeId: mongoose.Types.ObjectId, isManager: boolean): Promise<CustomerDocument[]> {
  return isManager
  ? this.find().exec()
  : this.find({ SupportRepId: employeeId}).exec();
};

const CustomerModel = mongoose.model<CustomerDocument, CustomerModelType>("Customer", customerSchema, "customer");
export default CustomerModel;