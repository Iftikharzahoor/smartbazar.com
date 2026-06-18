import bcrypt from 'bcryptjs';

async function test() {
  const hash = "$2a$12$m13fu10EKvH0OhgDHW9j0uDqeMrw1F.Dxp9Q1lFJeTzSXaNNJ3dQm";
  const match = await bcrypt.compare("customer12345", hash);
  console.log("Password matches:", match);
}
test();
