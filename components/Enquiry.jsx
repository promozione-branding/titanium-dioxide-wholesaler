"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function ContactForm({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP STATES
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // FORM STATES
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");

  // FIREBASE RECAPTCHA
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.recaptchaVerifier
    ) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );

        window.recaptchaVerifier.render();
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SEND OTP
    if (!otpSent) {
      try {
        if (phone.length !== 10) {
          return setSuccessMessage("Invalid phone number");
        }

        setLoading(true);
        setSuccessMessage("");

        const appVerifier = window.recaptchaVerifier;

        const result = await signInWithPhoneNumber(
          auth,
          `+91${phone}`,
          appVerifier
        );

        setConfirmationResult(result);
        setOtpSent(true);

        setSuccessMessage("OTP sent successfully");
      } catch (error) {
        console.log(error);
        setSuccessMessage("Something went wrong");
      } finally {
        setLoading(false);
      }

      return;
    }

    // VERIFY OTP + SUBMIT FORM
    try {
      setLoading(true);
      setSuccessMessage("");

      await confirmationResult.confirm(otp);

      const formData = {
        platform: "Titanium Dioxide Wholesaler Enquiry Form",
        platformEmail: "sales@aanyaenterprise.com",
         supplierToken: "6a19599b79a7cd6dff26a4c5",
        name,
        phone,
        email,
        place: "N/A",
        product,
        message,
      };

      const { data } = await axios.post(
        "https://brandbnalo.com/api/form/add",
        formData
      );

      if (data?.success) {
        setSubmitted(true);

        setSuccessMessage(
          "✅ Your enquiry has been submitted successfully!"
        );

        const whatsappText = `Hi, I am ${name}.
Email: ${email}
Product: ${product}

Message: ${message}

Contact: ${phone}`;

        const waUrl = `https://wa.me/+918527557778?text=${encodeURIComponent(
          whatsappText
        )}`;

        setTimeout(() => {
          window.open(waUrl, "_blank");
        }, 1000);

        // RESET FORM
        setName("");
        setPhone("");
        setEmail("");
        setProduct("");
        setMessage("");
        setOtp("");
        setOtpSent(false);

        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 4000);
      } else {
        setSuccessMessage("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setSuccessMessage("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div
        className="relative rounded-3xl shadow-2xl p-8 md:p-10 w-[350px] md:w-[570px] text-white bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dzbkxqqo9/image/upload/v1760072301/Titanium_Dioxide_bijcv9.png)",
        }}
      >
        <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>

        <div className="relative z-10">
          <button
            className="absolute top-4 right-4 text-white hover:text-red-500 text-xl cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="text-center text-white text-xl md:text-3xl font-semibold tracking-wide">
            Get In Touch With Us
          </h2>

          <div className="w-28 h-[4px] bg-[#F7C600] mx-auto mt-3 mb-8 rounded-full"></div>

          {!submitted ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 p-3 placeholder-gray-700 rounded-md text-black text-lg border-2 border-[#F7C600] focus:outline-none bg-white/90"
                  required
                  disabled={loading}
                />

                <select
                  name="products"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="flex-1 p-3 rounded-md text-black text-md border-2 border-[#F7C600] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#F7C600] transition appearance-none"
                  required
                  disabled={loading}
                >
                  <option value="" disabled hidden>
                    Select Product
                  </option>

                  <option value="Titanium Dioxide (TiO₂)">
                    Titanium Dioxide (TiO₂)
                  </option>

                  <option value="Titanium Dioxide Rutile">
                    Titanium Dioxide Rutile
                  </option>

                  <option value="Lithopone">
                    Lithopone
                  </option>

                  <option value="Optical Brighter">
                    Optical Brighter
                  </option>

                  <option value="Caustic Soda">
                    Caustic Soda
                  </option>

                  <option value="Calcium Carbonate">
                    Calcium Carbonate
                  </option>
                </select>
              </div>

              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                maxLength={10}
                minLength={10}
                placeholder="081234 56789"
                className="w-full p-3 rounded-md text-black text-lg border-2 border-[#F7C600] focus:outline-none bg-white/90"
                required
                disabled={loading}
              />

              

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md text-black text-lg border-2 border-[#F7C600] focus:outline-none bg-white/90"
                required
                disabled={loading}
              />

              <textarea
                name="message"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-md text-black text-md border-2 border-[#F7C600] focus:outline-none h-28 resize-none bg-white/90"
                required
                disabled={loading}
              ></textarea>

              {/* OTP FIELD */}
              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 rounded-md text-black text-lg border-2 border-[#F7C600] focus:outline-none bg-white/90"
                  required
                  disabled={loading}
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#F7C600] hover:bg-[#d6ac00] transition rounded-md font-semibold text-white text-md shadow-md"
              >
                {loading
                  ? "Processing..."
                  : otpSent
                  ? "Verify OTP"
                  : "Send Message"}
              </button>

              {successMessage && (
                <p
                  className={`text-center text-sm mt-2 font-medium ${
                    successMessage.includes("successfully") ||
                    successMessage.includes("OTP sent")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {successMessage}
                </p>
              )}

              {/* FIREBASE RECAPTCHA */}
              <div id="recaptcha-container"></div>
            </form>
          ) : (
            <p className="text-center text-white font-semibold text-lg">
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}