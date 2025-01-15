const AWS = require("aws-sdk");

AWS.config.update({ region: "af-south-1" });
const ses = new AWS.SES();

exports.handler = async (event) => {
  try {
    const {
      name,
      contactNumber,
      email,
      medicalAidProvider,
      medicalAidNumber,
      service,
      branch,
      preferredDate,
      alternateDate,
      message,
    } = JSON.parse(event.body);

    const emailParams = {
      Source: "booking@lighthousemedicare.co.za",
      Destination: {
        ToAddresses: ["booking@lighthousemedicare.co.za"], // Replace with your recipient's email
      },
      Message: {
        Subject: { Data: `New Appointment Request from ${name}` },
        Body: {
          Text: {
            Data: `Name: ${name}\nContact Number: ${contactNumber}\nEmail: ${email}\nMedical Aid Provider: ${medicalAidProvider}\nMedical Aid Number: ${medicalAidNumber}\nService: ${service}\nBranch: ${branch}\nPreferred Date: ${preferredDate}\nAlternate Date: ${alternateDate}\nMessage: ${message}`,
          },
          Html: {
            Data: `
                <html>
                  <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #0066cc;">New Appointment Request from ${name}</h2>
                    <table style="width: 100%; border: 1px solid #ddd; border-collapse: collapse; margin-top: 20px;">
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Name</td>
                        <td style="padding: 8px;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Contact Number</td>
                        <td style="padding: 8px;">${contactNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Email</td>
                        <td style="padding: 8px;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Medical Aid Provider</td>
                        <td style="padding: 8px;">${
                          medicalAidProvider || "N/A"
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Medical Aid Number</td>
                        <td style="padding: 8px;">${
                          medicalAidNumber || "N/A"
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Service</td>
                        <td style="padding: 8px;">${service}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Branch</td>
                        <td style="padding: 8px;">${branch}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Preferred Date</td>
                        <td style="padding: 8px;">${preferredDate || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Alternate Date</td>
                        <td style="padding: 8px;">${alternateDate || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold; background-color: #f4f4f4;">Message</td>
                        <td style="padding: 8px;">${message || "N/A"}</td>
                      </tr>
                    </table>
                  </body>
                </html>`,
          },
        },
      },
    };

    // Send email using SES
    const data = await ses.sendEmail(emailParams).promise();

    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully",
        data,
      }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
    };
  }
};
