import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

async function seedAdmin() {
  // connect to your DB and insert admin user
  const password = await bcrypt.hash('Admin@1234', 10);
  console.log('Hashed password:', password); // paste into DB
}
seedAdmin();