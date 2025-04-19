<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Legal & Compliance</h1>
    <p class="mb-6">Important legal information regarding the use of our service with Paddle payment processing</p>
    
    <!-- Compliance Tabs -->
    <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
      <button 
        @click="activeTab = 'terms'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'terms' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Terms of Service
      </button>
      <button 
        @click="activeTab = 'privacy'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'privacy' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Privacy Notice
      </button>
      <button 
        @click="activeTab = 'refund'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'refund' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Refund Policy
      </button>
      <button 
        @click="activeTab = 'product'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'product' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Product Info
      </button>
      <button 
        @click="activeTab = 'contact'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'contact' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Contact Us
      </button>
    </div>
    
    <!-- Terms of Service Tab -->
    <div v-if="activeTab === 'terms'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Terms of Service</h2>
      
      <div class="prose max-w-none">
        <h3 class="text-lg font-medium mb-3">1. Acceptance of Terms</h3>
        <p class="mb-4">
          By accessing or using the Swifties.io service ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
          If you do not agree to these Terms, please do not use the Service.
        </p>
        
        <h3 class="text-lg font-medium mb-3">2. Description of Service</h3>
        <p class="mb-4">
          Swifties.io provides a platform for users to rank music albums, songs, and eras. The Service may include premium features 
          that require payment through our payment processor, Paddle.
        </p>
        
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <h4 class="font-medium text-blue-800">Intellectual Property Notice:</h4>
          <p class="text-blue-800">
            Swifties.io is an unofficial fan application not affiliated with, endorsed by, or connected to Taylor Swift, 
            her management, record labels, or any official representatives. All artist names, album titles, song titles, 
            and related imagery are used for descriptive purposes only under fair use principles for commentary, criticism, 
            and fan discussion.
          </p>
        </div>
        
        <h3 class="text-lg font-medium mb-3">3. Free vs. Premium Service</h3>
        <p class="mb-4">
          3.1 <strong>Free Service:</strong> Basic access to the platform includes:<br>
          - Ability to create and view basic rankings<br>
          - Limited access to community features<br>
          - Standard user interface<br><br>
          
          3.2 <strong>Premium Service:</strong> For an annual fee of $19.99, premium users receive:<br>
          - Advanced ranking tools and visualization options<br>
          - Unlimited saved rankings<br>
          - Ad-free experience<br>
          - Priority access to new features<br>
          - Enhanced sharing capabilities<br>
          - Exclusive content and community features
        </p>
        
        <h3 class="text-lg font-medium mb-3">4. User Accounts</h3>
        <p class="mb-4">
          To access certain features of the Service, you may be required to create an account. You are responsible for maintaining 
          the confidentiality of your account information and for all activities that occur under your account.
        </p>
        
        <h3 class="text-lg font-medium mb-3">5. Subscription and Billing</h3>
        <p class="mb-4">
          5.1 Subscription fees are billed in advance on a recurring annual basis.<br>
          5.2 Payment processing is handled by Paddle, and you agree to be bound by Paddle's terms of service.<br>
          5.3 You can cancel your subscription at any time through your account settings or by contacting customer support.<br>
          5.4 Cancellation will take effect at the end of your current billing period.
        </p>
        
        <h3 class="text-lg font-medium mb-3">6. User Content</h3>
        <p class="mb-4">
          6.1 You retain ownership of any content you submit to the Service.<br>
          6.2 By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content.
        </p>
        
        <h3 class="text-lg font-medium mb-3">6A. User-Generated Content Guidelines</h3>
        <p class="mb-4">
          When submitting content to our Service, you agree to the following:
        </p>
        <div class="pl-4 mb-4">
          <p class="mb-2">6A.1 <strong>Ownership and Rights:</strong> You may only submit content that you own or have the right to use and share.</p>
          
          <p class="mb-2">6A.2 <strong>Copyright Compliance:</strong> You must not upload or share any content that infringes on the intellectual property rights of others, including copyrighted music, images, or videos without proper authorization.</p>
          
          <p class="mb-2">6A.3 <strong>Acceptable Content:</strong> User content must not contain:</p>
          <ul class="list-disc pl-5 mb-2">
            <li>Illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable material</li>
            <li>Content that impersonates Taylor Swift or her representatives</li>
            <li>Unauthorized commercial solicitations or spam</li>
            <li>Content that violates any applicable laws or regulations</li>
          </ul>
          
          <p class="mb-2">6A.4 <strong>Content Removal:</strong> We reserve the right to remove any user-generated content that violates these guidelines without prior notice.</p>
          
          <p class="mb-2">6A.5 <strong>Copyright Claims:</strong> If you believe your copyrighted work has been used inappropriately on our Service, please contact us at copyright@swifties.io with details of the alleged infringement.</p>
        </div>
        
        <h3 class="text-lg font-medium mb-3">7. Prohibited Conduct</h3>
        <p class="mb-4">
          You agree not to:<br>
          - Violate any laws or regulations<br>
          - Infringe on the rights of others<br>
          - Submit false or misleading information<br>
          - Interfere with the proper functioning of the Service<br>
          - Attempt to gain unauthorized access to the Service
        </p>
        
        <h3 class="text-lg font-medium mb-3">8. Termination</h3>
        <p class="mb-4">
          We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, 
          for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
        </p>
        
        <h3 class="text-lg font-medium mb-3">9. Changes to Terms</h3>
        <p class="mb-4">
          We may modify these Terms at any time. Your continued use of the Service after any changes indicates your acceptance of the new Terms.
        </p>
        
        <h3 class="text-lg font-medium mb-3">10. Limitation of Liability</h3>
        <p class="mb-4">
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
        </p>
        
        <h3 class="text-lg font-medium mb-3">11. Governing Law</h3>
        <p class="mb-4">
          These Terms shall be governed by the laws of the United Kingdom, without regard to its conflict of law provisions.
        </p>
        
        <h3 class="text-lg font-medium mb-3">12. Contact Information</h3>
        <p class="mb-4">
          For questions about these Terms, please contact us at support@swifties.io.
        </p>
        
        <p class="text-sm text-gray-500 mt-6">Last updated: April 18, 2025</p>
      </div>
    </div>
    
    <!-- Privacy Notice Tab -->
    <div v-if="activeTab === 'privacy'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Privacy Notice</h2>
      
      <div class="prose max-w-none">
        <h3 class="text-lg font-medium mb-3">1. Introduction</h3>
        <p class="mb-4">
          This Privacy Notice explains how Swifties.io ("we", "us", "our") collects, uses, and shares your personal information 
          when you use our service. We respect your privacy and are committed to protecting your personal data.
        </p>
        
        <h3 class="text-lg font-medium mb-3">2. Information We Collect</h3>
        <p class="mb-4">
          2.1 <strong>Information you provide to us:</strong> When you register for an account, we collect your email address, username, and password.<br>
          2.2 <strong>Payment information:</strong> When you make a purchase, our payment processor Paddle collects payment information.<br>
          2.3 <strong>Usage data:</strong> We collect information about how you interact with our service, including your rankings, preferences, and activity logs.<br>
          2.4 <strong>Device information:</strong> We collect information about the device you use to access our service.
        </p>
        
        <h3 class="text-lg font-medium mb-3">3. How We Use Your Information</h3>
        <p class="mb-4">
          We use your information to:<br>
          - Provide, maintain, and improve our service<br>
          - Process transactions and send related information<br>
          - Send you technical notices, updates, and support messages<br>
          - Respond to your comments and questions<br>
          - Monitor and analyze trends, usage, and activities<br>
          - Detect, prevent, and address technical issues
        </p>
        
        <h3 class="text-lg font-medium mb-3">4. Sharing Your Information</h3>
        <p class="mb-4">
          4.1 <strong>Service providers:</strong> We share information with third-party vendors, including Paddle for payment processing.<br>
          4.2 <strong>Legal requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities.<br>
          4.3 <strong>Business transfers:</strong> We may share information in connection with a merger, sale, or acquisition.
        </p>
        
        <h3 class="text-lg font-medium mb-3">5. Data Storage and Protection</h3>
        <p class="mb-4">
          5.1 <strong>Data storage:</strong> Your data is stored securely in cloud-based databases with industry-standard encryption.<br>
          5.2 <strong>Data retention:</strong> We retain your personal data only for as long as necessary to fulfill the purposes for which we collected it.<br>
          5.3 <strong>Security measures:</strong> We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>
        
        <h3 class="text-lg font-medium mb-3">6. Your Rights</h3>
        <p class="mb-4">
          Depending on your location, you may have rights regarding your personal data, including:<br>
          - Access to your personal data<br>
          - Correction of inaccurate data<br>
          - Deletion of your data<br>
          - Restriction of processing<br>
          - Data portability<br>
          - Objection to processing
        </p>
        
        <h3 class="text-lg font-medium mb-3">7. Compliance with Regulations</h3>
        <p class="mb-4">
          7.1 <strong>GDPR Compliance:</strong> For users in the European Union, we comply with the General Data Protection Regulation.<br>
          7.2 <strong>CCPA Compliance:</strong> For California residents, we comply with the California Consumer Privacy Act.<br>
          7.3 <strong>Other regulations:</strong> We strive to comply with all applicable data protection laws in the jurisdictions where we operate.
        </p>
        
        <h3 class="text-lg font-medium mb-3">8. Cookies and Tracking Technologies</h3>
        <p class="mb-4">
          We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>
        
        <h3 class="text-lg font-medium mb-3">9. Children's Privacy</h3>
        <p class="mb-4">
          Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>
        
        <h3 class="text-lg font-medium mb-3">10. Changes to This Privacy Notice</h3>
        <p class="mb-4">
          We may update our Privacy Notice from time to time. We will notify you of any changes by posting the new Privacy Notice on this page.
        </p>
        
        <h3 class="text-lg font-medium mb-3">11. Contact Us</h3>
        <p class="mb-4">
          If you have any questions about this Privacy Notice, please contact us at privacy@swifties.io.
        </p>
        
        <p class="text-sm text-gray-500 mt-6">Last updated: April 18, 2025</p>
      </div>
    </div>
    
    <!-- Refund Policy Tab -->
    <div v-if="activeTab === 'refund'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Refund Policy</h2>
      
      <div class="prose max-w-none">
        <h3 class="text-lg font-medium mb-3">1. Refund Eligibility</h3>
        <p class="mb-4">
          We want you to be satisfied with your purchase. If you are not completely satisfied with your subscription, 
          we offer refunds under the following conditions:
        </p>
        
        <h3 class="text-lg font-medium mb-3">2. Annual Subscription Refunds</h3>
        <p class="mb-4">
          2.1 <strong>14-Day Refund Period:</strong> You may request a full refund within 14 days of your initial subscription purchase.<br>
          2.2 <strong>Pro-rated Refunds:</strong> After the 14-day period, refunds may be issued on a pro-rated basis at our discretion.<br>
          2.3 <strong>Recurring Subscriptions:</strong> No refunds are provided for automatic renewal charges if the cancellation was not requested prior to the renewal date.
        </p>
        
        <h3 class="text-lg font-medium mb-3">3. How to Request a Refund</h3>
        <p class="mb-4">
          To request a refund:<br>
          3.1 Log in to your account and navigate to the billing section.<br>
          3.2 Click on "Request Refund" and follow the instructions.<br>
          3.3 Alternatively, contact our customer support at support@swifties.io with your order details.
        </p>
        
        <h3 class="text-lg font-medium mb-3">4. Processing of Refunds</h3>
        <p class="mb-4">
          4.1 Refunds will be processed through Paddle, our payment processor.<br>
          4.2 Refunds will be issued to the original payment method used for the purchase.<br>
          4.3 Processing time may vary depending on your payment provider, typically 5-10 business days.
        </p>
        
        <h3 class="text-lg font-medium mb-3">5. Exceptions</h3>
        <p class="mb-4">
          Refunds may be denied in the following cases:<br>
          5.1 The refund request is made after the eligible refund period.<br>
          5.2 There is evidence of fraud or abuse.<br>
          5.3 The account has violated our Terms of Service.
        </p>
        
        <h3 class="text-lg font-medium mb-3">6. Cancellation of Service</h3>
        <p class="mb-4">
          6.1 Cancellation of your subscription does not automatically qualify you for a refund.<br>
          6.2 You may cancel your subscription at any time through your account settings.<br>
          6.3 After cancellation, you will continue to have access to the service until the end of your current billing period.
        </p>
        
        <h3 class="text-lg font-medium mb-3">7. Special Circumstances</h3>
        <p class="mb-4">
          We understand that special circumstances may arise. If you believe you are entitled to a refund outside of our standard policy, 
          please contact our customer support team with details of your situation.
        </p>
        
        <h3 class="text-lg font-medium mb-3">8. Changes to This Policy</h3>
        <p class="mb-4">
          We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to our website.
        </p>
        
        <h3 class="text-lg font-medium mb-3">9. Contact Information</h3>
        <p class="mb-4">
          If you have any questions about our refund policy, please contact us at support@swifties.io.
        </p>
        
        <p class="text-sm text-gray-500 mt-6">Last updated: April 18, 2025</p>
      </div>
    </div>
    
    <!-- Product Information Tab -->
    <div v-if="activeTab === 'product'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Product Information</h2>
      
      <div class="prose max-w-none">
        <h3 class="text-lg font-medium mb-3">About Swifties.io</h3>
        <p class="mb-4">
          Swifties.io is the ultimate platform for Taylor Swift fans to rank, share, and discover music from their favorite artist.
          Our application allows fans (Swifties) to create personalized rankings of albums, songs, and eras, share their preferences
          with the community, and discover new perspectives on Taylor's extensive discography.
        </p>
        
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <h4 class="font-medium text-blue-800">Important Disclaimer:</h4>
          <p class="text-blue-800">
            Swifties.io is an <strong>unofficial fan application</strong> created by and for Taylor Swift fans. 
            This application is not affiliated with, endorsed by, or connected to Taylor Swift, 
            TAS Rights Management, Republic Records, Universal Music Group, or any of Taylor Swift's official representatives.
          </p>
          <p class="text-blue-800 mt-2">
            All artist names, album titles, song titles, and related imagery are used for descriptive purposes only. 
            Our use of these terms and images falls under fair use for the purpose of commentary, criticism, and fan discussion.
          </p>
        </div>
        
        <h3 class="text-lg font-medium mb-3">Target Audience</h3>
        <p class="mb-4">
          Our platform is designed specifically for Taylor Swift fans of all ages who want to:
          <ul class="list-disc pl-5 mb-4">
            <li>Create and save personalized rankings of Taylor Swift's music</li>
            <li>Compare their rankings with other fans</li>
            <li>Discover new perspectives on familiar songs and albums</li>
            <li>Connect with the global Swiftie community</li>
            <li>Track how their music preferences evolve over time</li>
          </ul>
        </p>
        
        <h3 class="text-lg font-medium mb-3">Key Features</h3>
        <div class="mb-4">
          <h4 class="font-medium">Free Features:</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>Basic album and song ranking capabilities</li>
            <li>View community rankings and trends</li>
            <li>Create a personal profile</li>
            <li>Access to standard visualization tools</li>
            <li>Limited saved rankings</li>
          </ul>
          
          <h4 class="font-medium">Premium Features (Annual Subscription: $19.99):</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>Advanced ranking tools with drag-and-drop interfaces</li>
            <li>Unlimited saved rankings and collections</li>
            <li>Enhanced visualization options including sunburst charts and timelines</li>
            <li>Ad-free experience</li>
            <li>Exclusive community features and discussions</li>
            <li>Priority access to new features and content</li>
            <li>Detailed analytics on your ranking history and preferences</li>
            <li>Enhanced sharing capabilities for social media</li>
          </ul>
        </div>
        
        <h3 class="text-lg font-medium mb-3">Value Proposition</h3>
        <p class="mb-4">
          Swifties.io offers a unique platform for fans to express their musical preferences in a structured, engaging way. 
          Unlike general music platforms, we focus exclusively on the Taylor Swift discography, providing depth and specificity 
          that general music apps cannot match. Our premium subscription offers enhanced tools and features that allow dedicated 
          fans to dive deeper into their musical journey with Taylor's work.
        </p>
        
        <h3 class="text-lg font-medium mb-3">Pricing</h3>
        <div class="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
          <h4 class="font-medium text-green-800">Premium Subscription:</h4>
          <p class="text-green-800 font-bold text-xl">$19.99 per year</p>
          <p class="text-green-700">Billed annually through our secure payment processor, Paddle.</p>
          <p class="text-green-700 mt-2">14-day money-back guarantee for new subscribers.</p>
        </div>
        
        <p class="text-sm text-gray-500 mt-6">Last updated: April 18, 2025</p>
      </div>
    </div>
    
    <!-- Contact Us Tab -->
    <div v-if="activeTab === 'contact'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Contact Us</h2>
      
      <div class="prose max-w-none">
        <h3 class="text-lg font-medium mb-3">Customer Support</h3>
        <p class="mb-4">
          Our dedicated support team is available to assist you with any questions, concerns, or issues you may have.
        </p>
        
        <div class="bg-white p-5 rounded-lg border border-gray-300 mb-6">
          <h4 class="font-medium mb-2">Email Support:</h4>
          <p class="mb-4">
            <a href="mailto:support@swifties.io" class="text-green-600 hover:text-green-800">support@swifties.io</a>
          </p>
          
          <h4 class="font-medium mb-2">Response Time:</h4>
          <p class="mb-4">
            We aim to respond to all inquiries within 24-48 hours during business days.
          </p>
          
          <h4 class="font-medium mb-2">Business Hours:</h4>
          <p class="mb-4">
            Monday - Friday: 9:00 AM - 5:00 PM (GMT)
          </p>
        </div>
        
        <h3 class="text-lg font-medium mb-3">Specific Inquiries</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-white p-4 rounded-lg border border-gray-300">
            <h4 class="font-medium mb-2">Billing & Subscription:</h4>
            <p>
              <a href="mailto:billing@swifties.io" class="text-green-600 hover:text-green-800">billing@swifties.io</a>
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-300">
            <h4 class="font-medium mb-2">Technical Support:</h4>
            <p>
              <a href="mailto:tech@swifties.io" class="text-green-600 hover:text-green-800">tech@swifties.io</a>
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-300">
            <h4 class="font-medium mb-2">Privacy Concerns:</h4>
            <p>
              <a href="mailto:privacy@swifties.io" class="text-green-600 hover:text-green-800">privacy@swifties.io</a>
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-300">
            <h4 class="font-medium mb-2">Business Inquiries:</h4>
            <p>
              <a href="mailto:business@swifties.io" class="text-green-600 hover:text-green-800">business@swifties.io</a>
            </p>
          </div>
        </div>
        
        <h3 class="text-lg font-medium mb-3">Company Information</h3>
        <div class="bg-white p-5 rounded-lg border border-gray-300 mb-6">
          <h4 class="font-medium mb-2">Swifties.io Ltd</h4>
          <p class="mb-1">123 Music Lane</p>
          <p class="mb-1">London, EC1A 1BB</p>
          <p class="mb-1">United Kingdom</p>
          <p class="mb-4">
            <a href="tel:+442071234567" class="text-green-600 hover:text-green-800">+44 20 7123 4567</a>
          </p>
          <p>
            <strong>Company Registration Number:</strong> 12345678
          </p>
        </div>
        
        <h3 class="text-lg font-medium mb-3">Contact Form</h3>
        <div class="bg-white p-5 rounded-lg border border-gray-300">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input type="text" id="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input type="email" id="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div class="mb-4">
            <label for="subject" class="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
            <input type="text" id="subject" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div class="mb-4">
            <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message:</label>
            <textarea id="message" rows="4" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
          </div>
          
          <div>
            <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Send Message
            </button>
          </div>
        </div>
        
        <p class="text-sm text-gray-500 mt-6">Last updated: April 18, 2025</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('terms');
</script>

<style scoped>
/* Add any component-specific styles here */
.prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
}
</style>
