"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const EnquiryForm = () => {
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
  const [place, setPlace] = useState("");

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

      const { data } = await axios.post(
        "https://brandbnalo.com/api/form/add",
        {
          platform: "Titanium wholesaler city page Enquiry Form",
          platformEmail: "sales@aanyaenterprise.com",
          name,
          phone,
          email,
          place,
          product,
          message,
        }
      );

      if (data?.success) {
        setSubmitted(true);

        setSuccessMessage(
          "✅ Your enquiry has been submitted successfully!"
        );

        const whatsappText = `Hi, I am ${name}.
Email: ${email}
Product: ${product}
Place: ${place}

Message: ${message}

Contact: ${phone}`;

        setTimeout(() => {
          window.open(
            `https://wa.me/918527557778?text=${encodeURIComponent(
              whatsappText
            )}`,
            "_blank"
          );
        }, 1000);

        // RESET
        setName("");
        setPhone("");
        setEmail("");
        setProduct("");
        setMessage("");
        setPlace("");
        setOtp("");
        setOtpSent(false);
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
    <section
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/dzbkxqqo9/image/upload/v1759726382/bg-layer_xpdfhz.webp)",
      }}
      className="relative bg-center bg-cover w-full py-12 px-4"
    >
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Quality You Can Trust
        </h2>

        <p className="text-black text-lg leading-relaxed mb-6">
          At{" "}
          <span className="font-semibold text-yellow-500">
            Aanya Enterprise
          </span>
          , we believe that the foundation of a trusted Titanium
          Dioxide wholesaler lies in
          <span className="font-semibold">
            {" "}
            uncompromised quality
          </span>
          .
        </p>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
        {/* Left Image */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="https://res.cloudinary.com/dzbkxqqo9/image/upload/v1759736912/Gemini_Generated_Image_hj0r03hj0r03hj0r_bnh9or.webp"
            alt="Application of Titanium Dioxide"
            width={450}
            height={400}
            className="object-cover rounded-xl z-10"
          />
        </div>

        {/* Right Form */}
        <div className="relative w-full max-w-lg border border-white/30 p-8 rounded-xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#333] rounded-xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-serif text-[#F7C600] text-center mb-8 drop-shadow-lg">
              Quick Enquiry
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              method="POST"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="p-3 rounded-md w-full bg-white/95 text-gray-800 outline-none border border-gray-300 focus:ring-2 focus:ring-[#F7C600]"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
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

                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 rounded-md w-full bg-white/95 text-gray-800 outline-none border border-gray-300 focus:ring-2 focus:ring-[#F7C600]"
                  required
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border border-gray-300 rounded-md bg-white/95 focus-within:ring-2 focus-within:ring-[#F7C600]">
                  <span className="px-2">🇮🇳</span>

                  <input
                    type="tel"
                    maxLength={10}
                    minLength={10}
                    placeholder="081234 56789"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    className="p-3 flex-1 rounded-md outline-none bg-transparent"
                    required
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 rounded-md w-full bg-white/95 text-gray-800 outline-none border border-gray-300 focus:ring-2 focus:ring-[#F7C600]"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="p-3 rounded-md w-full bg-white/95 text-gray-800 outline-none border border-gray-300 focus:ring-2 focus:ring-[#F7C600]"
                required
              />

              <textarea
                placeholder="Message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-3 rounded-md w-full bg-white/95 text-gray-800 outline-none border border-gray-300 focus:ring-2 focus:ring-[#F7C600]"
                required
              ></textarea>

              {/* OTP FIELD BELOW TEXTAREA */}
              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="p-3 rounded-md w-full bg-white/95 text-gray-800 outline-none border border-gray-300 focus:ring-2 focus:ring-[#F7C600]"
                  required
                />
              )}

              {/* SINGLE BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-sm font-medium transition"
              >
                {loading
                  ? "Processing..."
                  : otpSent
                  ? "Verify OTP"
                  : "Send Enquiry"}
              </button>

              {successMessage && (
                <p className="text-center text-white mt-4">
                  {successMessage}
                </p>
              )}

              {/* FIREBASE RECAPTCHA */}
              <div id="recaptcha-container"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;