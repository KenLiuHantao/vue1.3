<script>
    import logoImg from 'np/images/logo.png'
    export default {
        props: {
            isComponents: {
                type: Boolean
            }
        },
        data(){
            return{
                logoImg: logoImg,
                checked: false,
            }
        },
        methods: {
            goAnthor (id) {
                let ID = id
                if (!ID) return
                if (ID.substring(0, 1) != '#') {
                    ID = '#' + ID
                }
                let anthor = document.querySelector(ID)
                document.body.scrollTop = anthor.offsetTop
            },
            changeChecked () {
                this.checked = !this.checked
            },
            next () {
                this.$router.go({
                    name: 'createCompanyAccount'
                })
            },
            agreementReturn () {
                this.$emit('cb')
            },
        },
        ready () {
            console.log(this.isComponents)
        }
    }
</script>

<template>
    <header>
        <a href="/login">
            <img :src="logoImg">
            我的经管
        </a>
        <!--<a class="login" href="/login">已有账号？<span>点此登录</span></a>-->
    </header>

    <article class="main">
        <section class="content">
            <div class="title">
                <h2>我的经管软件服务条款</h2>
                <!--<a class="icon-modal__close" href="/login"></a>-->
            </div>

            <div class="scorll">
                <h3>使用条款</h3>
                <p>提示：在使用“我的经管”软件（以下简称“本软件”）之前，请您（以下又称“用户”）认真阅读并遵守《我的经管软件许可使用协议》（以下简称“本协议”），充分理解本协议内容，除非你接受本协议全部条款，否则你无权下载、复制、安装、使用本软件；如果您是企业用户，须保证您及所属员工或其他授权使用本软件的人员均接受并遵守本协议之约束。</p>
                <h3>一、有关本协议</h3>
                <p>1、本协议系深圳云集智造系统技术有限公司（下称“云集”）与注册、下载、安装、使用、本软件的用户之间所订立的法律协议。</p>
                <p>2、所有云集已经发布或将来可能发布的各项政策、规则、声明、通知、警示、提示、说明，均构成本协议的有效组成部分，与本协议具有同等法律效力。</p>

                <h3>二、权利声明</h3>
                <p>1、本软件是由云集独立自主开发并享有相关一切权利的企业管理软件，用户获得的许可为有偿、非独占使用许可。</p>
                <p>云集特别声明：云集开发的我的经管软件，仅为用户提供企业管理的工具和平台，云集并不参与用户的企业经营活动，且不对用户的软件使用行为或经营行为承担任何责任或进行任何担保。用户应当独立对其经营行为及后果负责且不得将本软件用于非法目的。</p>
                <p>2、本软件的一切知识产权，以及与软件相关的所有信息内容，包括但不限于：文字表述及其组合、图标、附加程序、电子文档等均为云集所有。</p>
                <p>3、云集可能会对本软件及其相关功能不定时进行变更、升级、修改或转移，并可能会在本软件中开发新的功能或提供其它服务。上述新的功能或服务如无其他说明，用户仍有权使用，但应适用本协议，且云集有权向用户另行收费。</p>

                <h3>三、用户须知</h3>
                <p>1、云集将通过手机客户端（iOS和Android版本）或电脑WEB端下载等方式向您提供本软件，但云集不向您提供光盘版软件或其他形式的复制品。</p>
                <p>2、本软件因企业经营模式的不同而划分为制造版、贸易版等不同版本，如您已注册使用其中一种版本，如需使用其他版本，请遵从其他版本的要求重新签订使用协议并支付费用。</p>
                <p>3、本软件目前主要提供企业内部资源管理（即IERP）功能，将来可能会提供广告服务等更多的功能或服务，这些功能或服务将会视用户需求的变化不定期推出，由用户根据自身需求选用。</p>
                <p>4、第三方应用</p>
                <p class="list">1）云集可能允许第三方软件或服务接入本软件平台，届时您可直接在本软件平台上使用广告、金融、电商等第三方应用。上述是为用户提供便利而设置，由用户选择使用。您选用该第三方应用或服务，请务必审慎注意及认真阅读第三方许可协议，以保障您的权利。</p>
                <p class="list">2）您了解并同意，对于第三方提供的软件或服务，云集仅提供平台接口，无权在本协议中授予您使用该等应用的任何权利，云集也无法对该等应用提供任何客户支持，更无法提供任何形式的保证，对于您使用上述应用的行为及后果云集均不负任何责任，如因您使用该应用引发任何纠纷，您可直接与该应用提供者（第三方）协商解决。</p>
                <p class="list">3）您了解并同意，云集无法保证该第三方应用的推出时间，无法保证本软件会永久性包含该第三方应用，云集有权视用户的需求、该第三方应用提供方的市场判断和云集的发展安排而增加或取消。</p>
                <p class="list">4）您了解并同意，如果该第三方确认您违反了你们之间关于使用该应用的约定，并停止对您提供该应用并要求云集处理的，您同意云集可以采取相应限制措施，如果停止该应用会影响您继续使用本软件的，云集可以采取中止、终止您对本软件的许可使用。</p>
                <p>5、云集保留在任何时候自行决定对本软件或本软件任何部分及其相关功能变更、升级、修改、转移、取消的权利。您同意，对于上述行为，云集均不需通知，并且对您和任何第三人不承担任何责任。</p>

                <h3>四、软件规范</h3>
                <p class="h">（一）使用原则</p>
                <p>云集许可您对本软件进行有偿的、非排他性的使用，本协议未明示授权的其他一切权利仍由云集保留，云集如果未行使前述任何权利，并不构成对该权利的放弃。</p>
                <p class="h">（二）账号注册及管理</p>
                <p>1、如需要使用本软件，您可以申请注册管理账号，通过云集的审核后可通过该管理账号输入自己企业内部信息、给予不同岗位人员设立子账号和授权，并可通过PC端或手持移动端登录我的经管软件账号，实现自己企业内部成员的沟通、工作互动等目的。</p>
                <p>2、您确认，您是具备完全民事权利能力和相应的民事行为能力的自然人、法人或其他组织。如您代表一家公司或其他法律主体进行注册或以其他云集允许的方式实际使用本软件，则您声明和保证该公司或该法律主体受本协议的约束。若您不具备前述主体资格，请勿使用本软件。</p>
                <p>3、您可以采取云集允许的方式注册账号，如您的本人的手机号等。同时，您应当按照法律法规和云集的要求，按相应页面的提示准确提供并及时更新您的资料，以使其真实、准确、及时和完整。</p>
                <p>4、您不得冒充他人或使用他人资料或信息进行注册，不得未经许可为他人注册，不得以可能导致其他用户误认的用户名进行注册，不得使用可能侵犯他人权益的用户名进行注册（包括但不限于涉嫌侵犯他人商标权、名誉权等），否则云集有权取消该账号。在某些情况下或需要使用某些功能时，云集有权要求您进行实名认证。</p>
                <p>如您涉嫌违法或侵权，云集有权应有权机构或被侵权方的请求，向其提供您的真实身份信息或相关违法侵权证据。</p>
                <p>5、您了解并同意，您注册的账号（包括管理账号及子账号）所有权归属于云集，注册完成后，您仅获得该账号的使用权。我的经管账号使用仅归属于初始申请注册人，您不得以任何方式转让或提供、允许、默认给他人使用，否则，云集有权立即不经通知收回该账号，由此给您带来的数据、信息等被清空、丢失等的损失，您应自行承担。除非有相关法院生效判决，否则，您的注册账户及其对应的权益不得以任何方式转让、赠与或继承。</p>
                <p>6、在您成功注册后，云集将根据账号和密码确认和分辨您的身份。您应妥善保管您的终端及账户和密码，并对使用该账户和密码所进行的一切活动（包括但不限于网上点击同意或提交各类作业请求、发送文字图片资料等）负全部责任。您承诺，在密码或账户遭到未获授权的使用，或者发生其他任何安全问题时，将立即通知云集，且您同意并确认，云集不对上述情形下产生的任何直接或间接的信息或数据丢失或损害承担责任。</p>
                <p>7、您了解并同意，如您注册本软件账号后连续超过2个月未登录或处在欠付许可费的状态，云集为网站优化管理之目的有权回收该账号，相关责任和损失由您自行承担。</p>
                <p>8、云集根据本协议收回或取消账号后，有权自行对该账号下的相关内容、数据及信息以包括但不限于删除等方式进行处理，且无需就此向您承担任何责任。</p>
                <p>9、您确认并同意，您申请了软件管理账号后可自行通过该账号增加其他成员账号（子账号），并对上述账号下的一切行为负责，同时接受云集对所有账号的监督管理。</p>
                <p class="h">（三）软件使用规范</p>
                <p>1、除非另有说明，本协议项下的软件只能用于非商业用途且限本人使用。您承诺不对本软件任何部分或本软件之使用或获得，进行复制、拷贝、出售、转售或用于包括但不限于广告及任何其它商业目的。</p>
                <p>2、您承诺不会利用本软件进行任何违法或不当的活动，包括但不限于下列行为∶</p>
                <p class="list">（1）从事违反法律法规政策、破坏公序良俗、损害公共利益的行为；</p>
                <p class="list">（2）未经甲方的书面同意，擅自将本软件或本软件中的任何部分出租、出借、转让或再许可给第三方使用；</p>
                <p class="list">（3）利用本软件发表、传送、传播、储存侵害他人知识产权、商业秘密等合法权利的内容，或从事欺诈、盗用他人账户、资金等违法犯罪活动；</p>
                <p class="list">（4）因本软件并非为某些特定目的而设计，您不可将本软件用于包括但不限于核设施、军事用途、医疗设施、交通通讯等重要领域。如您将本软件用作上述领域导致操作失败而造成自己或他人损失，概由您承担赔偿责任，云集不承担任何责任。</p>
                <p class="list">（5）其他以任何不合法的方式、为任何不合法的目的、或以任何与本协议不一致的方式使用本软件。</p>
                <p>3、您承诺不对本软件从事以下行为：</p>
                <P class="list">（1）对本软件及其中的相关信息擅自出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点，未经许可借助本软件发展与之有关的衍生产品、作品、服务、插件、外挂、兼容、互联等。</P>
                <P class="list">（2）复制、反汇编、修改本软件或其任何部分或制造其衍生作品；对本软件或者本软件运行过程中释放在终端中的任何数据及本软件运行过程中终端与服务器端的交互数据进行复制、修改、挂接运行或创作任何衍生作品，包括使用插件、外挂或非经授权的第三方工具/服务接入本软件和相关系统等形式。</P>
                <P class="list">（3）进行任何危害信息网络安全的行为，包括使用本软件时以任何方式损坏或破坏本软件或使其不能运行或干扰第三方对本软件的使用；未经允许进入或登陆他人账号或删除、修改、增加他人信息和数据；故意传播或向本软件平台或服务器发送恶意程序或病毒以及其他破坏、干扰本软件平台正常运行的行为；以非正常方式使用、访问本软件系统的行为；其他一切危害本软件平台或其他用户正常运行和使用的行为</P>
                <P class="list">（4）通过修改或伪造本软件运行中的指令、数据、数据包，增加、删减、变动本软件的功能或运行效果，及/或将具有上述用途的软件通过信息网络向公众传播或者运营。</P>
                <P>4、你了解并同意，您应当遵守有关法律及上述使用规范，如因您违反上述使用规范的行为对您或任意第三方造成损害的，您需要以自己的名义独立承担法律责任，并应确保云集免于因此产生损失或增加费用；如因您上述的违约行为使云集遭受任何损失，或受到任何第三方的索赔，或受到任何有权部门的处罚，您应当赔偿云集因此造成的损失及（或）发生的费用，包括合理的律师费用、调查取证费用、差旅费、鉴定费、公证费。</P>
                <P class="h">（四）软件风险提示</P>
                <P>1、您充分了解并同意，云集仅为用户提供软件平台，您应自行对利用本软件从事的所有行为及结果承担责任。相应地，您应了解，使用本软件可能发生来自他人非法或不当行为（或信息）的风险，您应自行判断及行动，并自行承担相应的风险。</P>
                <P class="list">同时，你应对使用本软件时所接触的内容及功能自行加以判断，并承担由此引起的所有风险，包括因对内容及功能的正确性、完整性或实用性的依赖等而产生的风险。云集无法且也不会对您因前述风险而导致的任何损失承担责任。</P>
                <P>2、您了解并同意，鉴于互联网软件的特殊性，云集有权随时中止、终止软件或其任何部分而无需向您发出通知。</P>
                <p>3、您了解并同意，云集可能定期或不定期地对提供网络软件的平台设备、设施和软硬件进行维护或检修，如因此类情况而造成全部或部分功能在合理时间内无法使用，云集无需承担责任，但应尽可能事先进行通告。</p>
                <p>4、如果云集发现或收到他人举报您有违反本协议约定或违法侵权行为的，云集有权不经通知随时对相关内容进行删除、屏蔽，并采取包括但不限于收回账号，限制、暂停、终止您使用部分或全部本软件，追究法律责任等措施。</p>
                <p>5、用户使用本软件时存储在软件上或服务器上的数据和信息，其所有权归用户，用户应当妥善保管和维护这些数据和信息，如有丢失、篡改或被他人攻击造成数据丢失，云集不承担任何责任。</p>
                <p class="list">云集为用户提供第三方服务器用于存储数据和信息，但对非因云集故意或重大过失造成的数据丢失，例如因服务器的提供方、网络提供方等他人原因等，云集不承担任何责任，但云集承诺，在可能的前提下，将尽力协助用户保存或恢复数据。</p>

                <h3>五、许可使用费</h3>
                <p>1、云集授予您的软件使用许可为有偿许可，请您遵从先付费后使用原则，并依云集公布之收费标准及接受的支付方式支付相关费用后使用。前述使用费不包含其它任何税款、费用或相关汇款等支出，否则您应补足付款或自行支付该费用。</p>
                <p>2、本软件平台上任何免费试用或免费的功能和服务不应视为云集放弃后续收费的权利。</p>
                <p>3、云集有权单方调整本软件收费标准，而无需获得您同意。云集将于每自然年度届满前7天内以公告形式通知您收费标准，若您继续使用本软件则需按云集公布的收费标准支付费用，如您不同意收费应当立即停止软件的使用，否则视为您已同意并应当缴纳费用。</p>
                <p>4、您应当自行支付使用本软件可能产生的上网费、其他第三方收取的通讯费、信息费及您基于本软件所需投入的硬件设施费用等。</p>
                <p>5、收费标准及付款方式：您应提前预付软件使用费，云集的最小收费周期为季度（三个月）。如您账户余额不足，云集有权停止您的使用。具体请与云集签订书面合同以确定。</p>

                <h3>六、隐私政策</h3>
                <p>1、云集尊重用户的隐私权并持续不断地改进与完善相关的技术手段和措施以保护您的信息安全。</p>
                <p>2、云集将尽最大的努力防止信息的丢失、不当使用、未经授权阅览或披露；如您注册的本软件账户具有密码保护功能，请您妥善保管账户及密码信息。但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全，您理解云集不能对此进行担保。同时，您需要了解，您使用本软件时的系统和通讯网络，也有可能因云集可控范围外的因素而出现问题。</p>
                <p>3、云集有权根据实际情况自行决定您在本软件或服务器中数据的最长储存期限、最大存储空间等，您应当保管好账号及密码，并妥善保管相关信息和内容，云集对前述原因导致的数据丢失或被盗以及在本软件中相关数据的删除或储存失败不承担责任。</p>
                <p>4、其他隐私条款见《我的经管软件隐私政策》，该隐私政策为本协议的有效构成部分，与本协议具有同等法律效力。</p>

                <h3>七、责任声明</h3>
                <p>1、本软件将按现呈软件功能的状态提供。云集在此明确声明对本软件及本软件涉及的技术信息等，不作任何明示或暗示的保证，包括但不限于对软件的可适用性、用途、有效性、准确性、安全性等。</p>
                <p>2、不论在何种情况下，云集均不对由于用户方的原因、第三方的原因、自然灾害、政府行为、司法行为、他人犯罪行为等所造成的本软件不能使用或延迟使用而承担责任。</p>
                <p>3、不论是否可以预见，云集均不对您由以下原因造成的任何直接的或间接的损失（包括但不限于营业中止、资料灭失、利润损失等）承担责任：</p>
                <p class="list">（1）使用或不能使用软件；</p>
                <p class="list">（2）通过软件购买或获取任何产品，样品，数据，信息或进行交易等，或其他可替代上述行为的行为而产生的费用；</p>
                <p class="list">（3）未经授权的存取或修改数据或数据的传输；</p>
                <p class="list">（4）第三方行为；</p>
                <p>4、您充分了解并同意，鉴于互联网体制及环境的特殊性，您在本软件中存储的信息及个人资料有可能会被他人复制、转载、擅改或做其它非法用途；您在此已充分意识此类风险的存在，并确认除非云集故意，否则此等风险应完全由您自行承担，云集对此不承担任何责任。</p>
                <p>5、您了解并同意，您在使用本软件过程中可能遭遇来自任何他人的包括威胁性的、诽谤性的、令人反感的或非法的内容或行为或对他人权利的侵犯（包括知识产权）及匿名或冒名的信息的风险，基于软件使用规范所述，该等风险应由您自行承担，云集对此不承担任何责任。</p>

                <h3>八、违约责任及赔偿</h3>
                <p>1、您同意，由于您通过本软件上载、传送或分享之信息、使用本软件其他功能、违反本协议、或您侵害他人任何权利因而衍生或导致任何第三人向云集及其关联公司提出任何索赔或请求，或云集及其关联公司因此而发生任何损失，您同意将足额进行赔偿（包括但不限于合理律师费、鉴定费、差旅费等）。</p>
                <p>2、如您存在下列违约情形之一，云集可立即对您中止或终止软件，并要求您赔偿损失：</p>
                <p class="list">（1）违反本协议约定义务或规则的；</p>
                <p class="list">（2）未按规定支付费用或账户余额不足的；</p>
                <p class="list">（3）违反本协议软件使用规范。</p>
                <p>3、您同意，如因云集原因导致付费用户发生损失，云集的最高赔偿额不超过当季收取的软件使用费的两倍。对未付费用户或欠费用户，云集不承担损失赔偿责任。</p>

                <h3>九、送达与通知</h3>
                <p>1、您确认并保证，提供给云集的电子邮件、手机号码、传真、经营地址等均为真实有效的联系方式，云集向您发出的任何通知均可采用电子邮件、页面公开区域公告、个人网络区域提示、手机短信、常规信件或您在本软件中的账号、收件箱、弹出页面或窗口的方式，此类通知自发送之日视为有效送达；如采取常规信件等方式，则该通知自寄出之日为有效送达。</p>
                <p>2、您同意，您向云集发出的任何通知应发至云集网站或我的经管平台对外正式公布或告知用户的电子邮件、通信地址，或使用其他云集认可的其他通知方式进行送达。</p>

                <h3>十、争议解决及其他</h3>
                <p>1、本协议之解释与适用，以及与本协议有关的争议，均应依照中华人民共和国法律予以处理，并以云集所在地法院为管辖法院。</p>
                <p>2、如本协议的任何条款被视作无效或无法执行，则该条款可被分离，其余部份则仍具有法律效力。</p>
                <p>3、如云集基于某一用户过失或违约时放弃本协议规定的权利的，不得视为其对其他用户的其他或以后同类之过失或违约行为弃权。</p>
                <p>4、云集有权根据业务调整情况将本协议项下的全部权利义务一并转移给其关联公司或第三方，转让将以本协议规定的方式通知，您承诺对此不持有异议。</p>
            </div>

            <div v-if="isComponents" class="btn">
                <button @click="agreementReturn" class="btn-lg-imp">返回</button>
            </div>
        </section>

        <div v-if="!isComponents" class="handle">
            <a href="https://yj2025.com/login"><button @click="" class="btn-lg-imp">返回首页</button></a>
        </div>
    </article>

    <!--<footer>-->
    <!--<span><a href="http://www.miitbeian.gov.cn">云集智造 2015-2017 粤ICP备16020594号</a></span>-->
    <!--</footer>-->
</template>

<style lang="less" scoped>
    @import "../../../../../public/css/serverCommon.less";
    .login {

        span {
            color: #03A9F4;
        }
    }

    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 0;
    }

    .title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 24px 20px 6px;

        h2{
            font-size: 20px;
            font-weight: normal;
            text-align: center;
        }
    }

    .content {
        width: 100%;
        max-width: 1200px;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 0 1px 7px 1px rgba(0, 0, 0, 0.3);
        color: #212121;

        h3 {
            margin: 30px 0 18px;
            font-size: 16px;
            font-weight: normal;
        }

        p {
            &:first-of-type {
                margin-left: 0;
            }
            margin-left: 14px;
            margin-bottom: 10px;
            color: #666666;
            font-size: 12px;
            text-align: justify;
            line-height: 1.5;

            &.h {
                color: #212121;
            }
            &.list {
                color: #999999;
            }
        }

        .btn {
            display: flex;
            justify-content: center;
            padding-bottom: 45px;
        }
    }

    .scorll {
        padding: 0 120px 35px;
        overflow-y: auto;
    }

    .handle {
        padding-top: 40px;
        text-align: center;
        > label {
            display: block;
            margin-bottom: 16px;
            > span {
                color: #03a9f4;
            }
        }
        > button {
            width: 240px;
        }
    }
</style>
