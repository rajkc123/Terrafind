import { useContext } from "react";
import "./HelpPage.scss";

import { AuthContext } from "../../context/AuthContext";

function HelpPage() {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className="helpPage">
            <div className="container">
                {/* Left Section - Contact Us */}
                <div className="contactSection">
                    <h2 className="subtitle">Contact Us</h2>
                    <form className="contactForm">
                        <label>
                            Email Address
                            <input type="email" placeholder="Enter your email" required />
                        </label>
                        <label>
                            Subject
                            <input type="text" placeholder="Enter the subject" required />
                        </label>
                        <label>
                            Message
                            <textarea placeholder="Explain your issue or question" rows="5" required></textarea>
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>

                {/* Right Section - FAQs */}
                <div className="faqSection">
                    <h2 className="subtitle">Frequently Asked Questions</h2>
                    <div className="faqContainer">
                        <div className="faq">
                            <h3>How do I list a property?</h3>
                            <p>
                                To list a property, navigate to the "Add Property" section in your own Profile. Fill in the details, upload images, and click "Submit."
                            </p>
                        </div>
                        <div className="faq">
                            <h3>How do I contact a property owner?</h3>
                            <p>
                                On each property details page, you'll find a "Send Message" button. Click it to contact the owner directly through our messaging system.
                            </p>
                        </div>
                        <div className="faq">
                            <h3>Can I save properties for later?</h3>
                            <p>
                                Yes, simply click the "Save" button on any property listing to add it to your saved properties list for quick access later.
                            </p>
                        </div>
                        <div className="faq">
                            <h3>What payment methods are supported?</h3>
                            <p>
                                Terrafind currently does not handle payments directly. All financial arrangements are handled between property owners and seekers.
                            </p>
                        </div>
                        <div className="faq">
                            <h3>Is Terrafind available in cities outside Kathmandu?</h3>
                            <p>
                                Currently, Terrafind focuses on Kathmandu, but plans are underway to expand to other major cities like Pokhara and Chitwan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpPage;
