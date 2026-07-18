"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");

  // OTP STATES
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // AUTO OPEN POPUP
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // FIREBASE RECAPTCHA
  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );

      window.recaptchaVerifier.render();
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SEND OTP
    if (!otpSent) {
      try {
        setLoading(true);
        setStatus("");

        const appVerifier = window.recaptchaVerifier;

        const result = await signInWithPhoneNumber(
          auth,
          `+91${phone}`,
          appVerifier,
        );

        setConfirmationResult(result);
        setOtpSent(true);

        setStatus("OTP sent successfully");
      } catch (error) {
        console.log(error);
        setStatus("Something went wrong");
      } finally {
        setLoading(false);
      }

      return;
    }

    // VERIFY OTP + SUBMIT FORM
    try {
      setLoading(true);
      setStatus("");

      await confirmationResult.confirm(otp);

      const formData = {
        platform: "Titanium Dioxide Wholesaler Popup Form",
        platformEmail: "sales@aanyaenterprise.com",
        name,
        phone,
        email,
        place: "N/A",
        product,
        message,
      };

      const { data } = await axios.post(
        "https://brandbnalo.com/api/form/add",
        formData,
      );

      if (data?.success) {
        setStatus("✅ Your enquiry has been submitted successfully!");

        const whatsappText = `Hi, I am ${name}.
Email: ${email}
Product: ${product}

Message: ${message}

Contact: ${phone}`;

        const waUrl = `https://wa.me/+918527557778?text=${encodeURIComponent(
          whatsappText,
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
          setIsOpen(false);
        }, 3000);
      } else {
        setStatus("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setStatus("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl md:max-w-5xl h-auto flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/90 to-white/80">
        <button
          className="absolute top-4 right-4 text-gray-800 hover:text-red-500 text-2xl z-50"
          onClick={handleClose}
        >
          ✕
        </button>

        <div className="hidden md:block w-full md:w-1/2 h-64 md:h-auto relative">
          <Image
            src="https://res.cloudinary.com/dzbkxqqo9/image/upload/v1759744551/Gemini_Generated_Image_fpz1x1fpz1x1fpz1_1_lpjciw.webp"
            alt="Contact Us"
            fill
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white/90 backdrop-blur-sm relative z-30 overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
            Get In Touch With Us
          </h2>

          <div className="w-20 h-[3px] bg-[#F7C600] mx-auto mb-6 rounded-full"></div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Your Name"
                className="flex-1 p-3 rounded-lg text-black text-sm border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white/90 shadow-sm transition"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />

              <select
                className="flex-1 p-3 rounded-lg text-black text-sm border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white/90 shadow-sm transition"
                required
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                disabled={loading}
              >
                <option value="">Select Product</option>
                <option value="Titanium Dioxide (TiO₂)">
                  Titanium Dioxide (TiO₂)
                </option>
                <option value="Titanium Dioxide Rutile">
                  Titanium Dioxide Rutile
                </option>
                <option value="Lithopone">Lithopone</option>
                <option value="Optical Brighter">Optical Brighter</option>
                <option value="Caustic Soda">Caustic Soda</option>
                <option value="Calcium Carbonate">Calcium Carbonate</option>
              </select>
            </div>

            <input
              type="tel"
              maxLength={10}
              minLength={10}
              pattern="[0-9]{10}"
              placeholder="081234 56789"
              className="w-full p-3 rounded-lg text-black text-sm border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white/90 shadow-sm transition"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg text-black text-sm border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white/90 shadow-sm transition"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <textarea
              placeholder="Message"
              className="w-full p-3 rounded-lg text-black text-sm border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white/90 shadow-sm transition h-28 resize-none"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            ></textarea>

            {/* OTP FIELD */}
            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 rounded-lg text-black text-sm border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white/90 shadow-sm transition"
                required
                disabled={loading}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#F7C600] to-[#F7A400] hover:opacity-90 transition rounded-lg font-semibold text-white text-sm shadow-lg"
            >
              {loading
                ? "Processing..."
                : otpSent
                  ? "Verify OTP"
                  : "Send Message"}
            </button>

            {status && (
              <p
                className={`text-center text-sm mt-2 font-medium ${
                  status.includes("successfully") || status.includes("OTP sent")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {status}
              </p>
            )}

            {/* FIREBASE RECAPTCHA */}
            <div id="recaptcha-container"></div>
          </form>
        </div>
      </div>
    </div>
  );
}
