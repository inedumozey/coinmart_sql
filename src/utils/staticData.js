import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import RoundaboutRightIcon from '@mui/icons-material/RoundaboutRight';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AlarmIcon from '@mui/icons-material/Alarm';
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import WorkspacesIcon from '@mui/icons-material/Workspaces';


const name = "Extractcoinmart",
    investment = 'Investment',
    regData = 2015,
    founded = 2013,
    memData = 2010


const staticData = {
    contact: {
        email: 'admin@extractcoinmart.com',
        countryCode: '+1',
        mobile: '+1(918) 280-8396',
        whatsAppMobile: '(918)280-8396',
        address: '9Co Meath C15 T26E 14 Mullaghaboy Industrial Estate, Plymouth, Indiana',
        name,
        investment
    },
    info: {
        // footerWord: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, reprehenderit? Doloremque, nemo similique dicta unde animi commodi temporibus? Natus mollitia labore amet harum soluta ratione voluptates blanditiis ut quas sit.',
        // secure: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, cum?`,
        // invest: 'Dolor',

        footerWord: 'We are the only Company offering accessible and secure Cloud-Mining solutions to everyone. We strive to ensure that Cryptocurrency remains decentralized by contributing to the network whilst sharing most of the gained mining incentives with our customers.',
        secure: `Secure and Easy way to`,
        invest: 'Invest'
    },
    countryUrl: "https://restcountries.eu/rest/v2/all",

    // movingText: [`How are you my Friend?`, `Welcome to Drmo.`, `Have a nice day!`],
    movingText: [`Thanks for investing with ${name}.`, `Have a nice day!`],

    num: 20,
    fetchDataErrorMsg: "Failed to load data, please refresh the browser",
    noDataMsg: "No data at the moment",
    home_page_section2_title: "The Next-Generation Digital Investment",
    home_page_section2_body: "We are an experienced investment company that offers diverse business options to customers. We trade in monetary, financial and crypto currency in large scale market.",

    home_page_section3_title: "Why choose investment plan",
    home_page_section3_body: "We provide lasting Business investment for potential investors worldwide anytime anywhere so as to lift the future of Bitcion and digital banking with zero cost.",
    home_page_section3_data: [
        {
            icon: RequestQuoteIcon,
            title: 'Secured Wallet',
            body: "For every $ Invested we have it backed by sophisticated Hardware. Choose when and how much to Withdraw."
        },
        {
            icon: AutoModeIcon,
            title: 'Secure Investment',
            body: "The coins we mine are all about Privacy, security and transparency, we totally comply with these ideals at all time."
        },
        {
            icon: RoundaboutRightIcon,
            title: 'Total Transperancy',
            body: "Your mining outputs are automatically added to your account daily. No hidden fees or commissions."
        },
        {
            icon: TroubleshootIcon,
            title: 'Unlimited Support',
            body: "We provide professional expert support 24/7. Our online Chat is ready to respond to your every needs."
        },
        {
            icon: HomeWorkIcon,
            title: 'Real Estate',
            body: "We buy and sell properties from United States and a few European countries to make resonable profits."
        },
        {
            icon: CurrencyBitcoinIcon,
            title: 'Bitcoin Trading',
            body: "BTC and cryptocurrency trading is one thing we know how to do best, our experts are at alert."
        }


    ],

    home_page_section4_quote: 'There was a time, just a decade ago when a dollar can buy you a Bitcoin, lots of people ignored the innovation.But today, what are we seeing? Most of those who were aware are now regretting why they never invested in it. The best time to invest is now.',
    home_page_section4_quote_by: "Paul Wilson, CEO",

    home_page_section6_title: 'Deposit and withdrawals history',
    home_page_section6_body: 'As part of our transperancy policy we createed this system to automatically display the latest deposit and withdrawal.',
    home_page_section6_deposit: [
        {
            userId: { username: 'angela' },
            amountReceived: 789,
            createdAt: "2022-12-08T08:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'haley' },
            amountReceived: 7800,
            createdAt: "2022-12-08T06:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'hernandez' },
            amountReceived: 5000,
            createdAt: "2022-12-07T06:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'nathaly' },
            amountReceived: 400,
            createdAt: "2022-12-06T08:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'joyce' },
            amountReceived: 1100,
            createdAt: "2022-12-06T06:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'holloway' },
            amountReceived: 1000,
            createdAt: "2022-12-05T06:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'george' },
            amountReceived: 2000,
            createdAt: "2022-12-04T06:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'archer' },
            amountReceived: 2050,
            createdAt: "2022-12-04T04:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'burch' },
            amountReceived: 1830,
            createdAt: "2022-12-04T02:23:49.309Z",
            currency: 'USD'
        },
        {
            userId: { username: 'damaris' },
            amountReceived: 789,
            createdAt: "2022-12-04T01:23:49.309Z",
            currency: 'USD'
        },
    ],

    home_page_section6_withdrawal: [
        {
            userId: { username: 'olive' },
            amount: 1000,
            createdAt: "2022-12-08T06:23:49.309Z",
            coin: 'USDT',
            currency: 'USD'

        },
        {
            userId: { username: 'walker' },
            amount: 1050,
            createdAt: "2022-12-08T02:23:49.309Z",
            coin: 'USDT',
            currency: 'USD'

        },
        {
            userId: { username: 'hernandez' },
            amount: 2300,
            createdAt: "2022-12-08T01:23:49.309Z",
            coin: 'BITCOIN',
            currency: 'USD'

        },
        {
            userId: { username: 'lucas' },
            amount: 1000,
            createdAt: "2022-12-07T08:23:49.309Z",
            coin: 'LITECOIN',
            currency: 'USD'

        },
        {
            userId: { username: 'joyce' },
            amount: 1500,
            createdAt: "2022-12-07T06:23:49.309Z",
            coin: 'BITCOIN',
            currency: 'USD'

        },
        {
            userId: { username: 'holloway' },
            amount: 2100,
            createdAt: "2022-12-06T06:23:49.309Z",
            coin: 'LITECOIN',
            currency: 'USD'

        },
        {
            userId: { username: 'paul' },
            amount: 1000,
            createdAt: "2022-12-06T01:23:49.309Z",
            coin: 'USDT',
            currency: 'USD'

        },
        {
            userId: { username: 'chan' },
            amount: 1050,
            createdAt: "2022-12-05T04:23:49.309Z",
            coin: 'LITECOIN',
            currency: 'USD'

        },
        {
            userId: { username: 'andre' },
            amount: 1030,
            createdAt: "2022-12-04T03:23:49.309Z",
            coin: 'LITECOIN',
            currency: 'USD'

        },
        {
            userId: { username: 'jessey' },
            amount: 7890,
            createdAt: "2022-12-04T02:23:49.309Z",
            coin: 'BUSDT',
            currency: 'USD'

        },
    ],

    home_page_section7_text: 'Our investment plan world wide business relations for development',

    home_page_section8_title: 'Global investment plan news',
    home_page_section8_body: 'Read our latest publication which is related to our kind of business and investment platform.',
    home_page_section8_data: [
        {
            title: "Creative design and clients response is better",
            author: 'Admin',
            createdAt: "2022-12-12T06:21:20.209Z",
            comment: 12,
            image: '/b1.jpg'
        },
        {
            title: "Tech is the future of the world",
            author: 'Admin',
            createdAt: "2022-12-11T01:20:19.319Z",
            comment: 16,
            image: '/b2.jpg'
        },
        {
            title: "You can trust me and business together",
            author: 'Admin',
            createdAt: "2022-11-05T26:12:49.509Z",
            comment: 7,
            image: '/b3.jpg'
        },
        {
            title: "We grow business into the future",
            author: 'Admin',
            createdAt: "2022-10-03T20:22:19.339Z",
            comment: 20,
            image: '/b4.jpg'
        },
        {
            title: "How to make more profit in your business",
            author: 'Admin',
            createdAt: "2022-10-03T03:16:40.359Z",
            comment: 9,
            image: '/b5.jpg'
        },
        {
            title: "Business and investment, what to consider",
            author: 'Admin',
            createdAt: "2022-09-07T01:18:18.269Z",
            comment: 59,
            image: '/b6.jpg'
        },
    ],

    home_page_section9_title: 'Our customer say about us',
    home_page_section9_body: 'Our investment is almost risk-free. We also have full insurance cover in case of any lose. So your investment with us is assured. You have nothing to worry about.',
    home_page_section9_data: [
        {
            text: `I would absolutely recommend ${name} ${investment}, I was initially skeptical about joining but i thank God i did and i have no regret.`,
            image: '/1.jpg',
            author: 'Hamilton',
            role: 'Client',
            ratings: 5
        },
        {
            text: `I was at a broke state before i met a ${name} ${investment}, representative and I am gland i didnt hesitate to invest`,
            image: '/2.jpg',
            author: 'Angel Lima',
            role: 'Client',
            ratings: 3
        },
        {
            text: `I havw been working with ${name} ${investment}, since 2019 and i think investing was the best decision I have ever made plus their customer service is on point.`,
            image: '/3.jpg',
            author: 'Arthur Doil',
            role: 'Client',
            ratings: 5
        },
        {
            text: `easy to invest, awesome customer service, easy to user interface`,
            image: '/4.jpg',
            author: 'Gabriel Hank',
            role: 'Client',
            ratings: 4
        }
    ],

    realEstate_title: "IMPORTANT REAL ESTATE DETAILS!.",
    realEstate_body: "Within minutes, you can create an account, choose your portfolio strategy, and watch as your dollars are diversified across a series of real estate properties tailored to your selected strategy. To access our real estate services, sign up and email admin.",
    realEstate_data: [
        {
            icon: AccessibilityIcon,
            title: 'Who Can Invest In Real Estate?',
            body: "Any U.S citizen (or permanent resident) currently residing in the U.S. who is over the age of 18. No accreditation required."
        },
        {
            icon: AlarmIcon,
            title: 'Is Real Estate A Long-Term Investment?',
            body: `Absolutely. Investments in ${name} real estate should be viewed as long-term (5+ years). This is because nearly all of the most effective real estate investing strategies require a combination of both expertise and time to pay off.`
        },
        {
            icon: HolidayVillageIcon,
            title: 'Real Estate Assets',
            body: `${name} ${investment} offers unprecedented transparency into what you actually own. Each of our portfolios offers exposure to a mix of some of all of the projects listed below, plus ongoing updates about the progress of individual investments.`
        },
        {
            icon: RequestQuoteIcon,
            title: 'How Much Profit Can I Expect?',
            body: "The amount of profit you can make on real estate depends on your investment choice and the amount you invested, our average investor gets above 30% ROI"
        },
        {
            icon: EmergencyShareIcon,
            title: 'Should I Be Worried About Losses?',
            body: `No. ${name} ${investment}is risk-free and We have a team of professionals with years of experience in real estate.`
        }
    ],

    faq_title: 'Some important FAQ',
    faq_body: 'Our frequently asked questions.',
    faq_data: [
        {
            question: `What is ${name} ${investment}?`,
            answer: `${name} ${investment} is officially registered in the United states ${regData}. ${name} ${investment} is an investment company, which was founded in ${founded} by commercial traders with many years of experience of successful activity in the financial market. Since ${memData}, our team has been developing its own strategies of trading and currency exchange applying all professional knowledge, techniques and skills that allow us to generate stable cash flows with minimal risk of financial loss.`
        },
        {
            question: `Why is the Long Term Plan Different from the Basic Plans?`,
            answer: `Long term plans are being traded on a unique automated platform different from the regular plans.`
        },
        {
            question: `What are the riskd of loss of Funds for Investors?`,
            answer: `${name} ${investment} is a platform which is risk-free. However, to avoid unforseen loss, the company continuously fills in its contingency fund. In the case of force majeure situations, Exploit stocks investors can expect to receive money back except the profits they received earlier.`
        },
        {
            question: `How can I start investing with Exploit Stocks?`,
            answer: `In order to begin, you should register on our website by filling the registration form. Just click on "Register". After that, you can start investing with us. Please make sure that you must have an e-currency account and must be of legal age of at least 18 years old.`
        },
        {
            question: `Can I make multiple Deposits?`,
            answer: `Yes you can make multiple deposits at any given time. There is no limit to the amount and the number of transactions you make within our program. You can make a deposit from different and multiple payment processors as well.`
        }
    ],

    about_page_section1_data: [
        {
            title: "HOW WE WORK",
            discription: `Quality assets, Low fees, Smart technology. We blend our investment expertise with smart technology to provide our 170,000 investors with the buying power and investment opportunities traditionally reserved for billion dollar institutions. Your portfolio is powered by high-quality, resilient assets. Our assets drive your returns. We pair our extensive network and expertise with the collective buying power of our investor community to acquire high-quality assets ranging from debt to equity, commercial to residential, and more. We follow a "value investing" strategy of acquiring assets for less than what we believe is their intrinsic value, and typically less than their replacement cost. Our team then works to increase the value of each asset over time through hands-on management and in partnership with local operators. We've specifically built the ${name} portfolio with the intention of being able to withstand prolonged periods of economic distress. Nothing can be guaranteed, but because of our conservative approach and extensive underwriting processes, we believe the ${name} portfolio is, from a risk-adjusted-return standpoint, well positioned to be able to sustain a severe economic downturn.`
        },
        {
            title: "OUR MODEL",
            discription: `Your returns are maximized through our low-fee approach. While historically profitable, the real estate investing industry is notorious for its high advisory fees, hidden management fees, and return-limiting performance fees.${name} investors are arguably able to own real property in a more low-cost way than was previously ever possible. We've reduced our costs and your fees to ensure you keep more of what you earn. We did this by designing new software that makes dozens of expensive-but-required processes much cheaper at scale. We also handle virtually every piece of the real estate business in-house. We work directly with real estate developers and operators, handle our own financials, and manage our own deals. Because we've eliminated most intermediaries, we're able to keep our expenses low.`
        },
        {
            title: "OUR PLATFORM",
            discription: `Your first investment is just the beginning. Within minutes, you can create an account, choose your portfolio strategy, and watch as your dollars are diversified across a series of investment funds tailored to your selected strategy. After you place your initial investment, we'll keep working to find and add new assets to your portfolio over time — with no additional investment required on your end. This means your already-diversified portfolio can become stronger year after year. Through your login to your portfolio, you can watch each asset in your portfolio evolve over time. We regularly publish new asset updates, including milestones like new construction progress, occupancy reports, market data trends, and project completion alerts. Where traditional investment firms typically build black boxes around their individual investments, we see an opportunity to deliver an extraordinarily rich and transparent investing experience. Click on learn more to contact the Admin for more information.`
        },
    ],

    about_page_section2_data: [
        {
            icon: TrackChangesIcon,
            title: 'Our Mission',
            body: "We are on a mission to change the world and we are changing the world"
        },
        {
            icon: RemoveRedEyeIcon,
            title: 'Our Vision',
            body: "Over 8years experience in the industry so you have nothing to worry about"
        },
        {
            icon: WorkspacesIcon,
            title: 'Our Experience',
            body: "Our vision is to ensure every investors get all their vision"
        }


    ],

    about_page_section3_text: `Our worldwide integration partner work with long time relationship`,

    about_page_section4_part1_title: `We also offer real estate services`,
    about_page_section4_part1_body: 'Within minutes, you can create an account, choose your portfolio strategy, and watch as your dollars are diversified across a series of real estate properties tailored to your selected strategy. To access our real estate services, sign up and email admin. We also offer real estate services',
    about_page_section4_part1_body2: 'IMPORTANT REAL ESTATE DETAILS!.',
    about_page_section4_part1_data: [
        {
            item: `Who can invest in Real estate? Any U.S. citizen (or permanent resident) currently residing in the U.S. who is over the age of 18. No accreditation required.`
        },
        {
            item: `Is Real estate a long-term investment? Absolutely. Like all private real estate investments, investments in ${name} real estate should be viewed as long-term (5+ years). This is because nearly all of the most effective real estate investing strategies require a combination of both expertise and time to pay off. We select strategies based on their long-term return potential for our investors, not short-term optics. If you anticipate needing your investment back in the near-term, we don't recommend investing with us.`
        },
        {
            item: `Real Estate Assets ${name} ${investment} offers unprecedented transparency into what you actually own. Each of our portfolios offers exposure to a mix of some of all of the projects listed below, plus ongoing updates about the progress of individual investments.`
        }

    ],
    about_page_section4_part2_title: 'Risk free investment system of our policy',
    about_page_section4_part2_body: 'Easy & Convenient All our systems are built and updated with the client in mind. Starting from our account opening procedure, to managing your account, depositing or withdrawing funds. With our extensive investment network, you can invest any currency or crypto you are interested in as you will have all the necessary tools and information and earn more money.',
    about_page_section4_part2_data: [
        {
            item: `Innovation idea latest business tecnology`
        },
        {
            item: `Digital content marketing online clients plateform`
        },
        {
            item: `Safe secure services for you online email account`
        }
    ],

}

export default staticData