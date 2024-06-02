import React from "react";
import QRCode from "react-qr-code";
import InputWidthImage from "./InputWithImage";
import ButtonCustom, { buttonType } from "./ButtonCustom";
import AlertCustom from './AlertCustom';
import { useTranslation } from "react-i18next";

function WalletNewDeposit() {
	// đa ngôn ngữ 
	const { t } = useTranslation();

	return (
		<div className="wallet-new-deposit">
			<InputWidthImage />
			<div className="network">
				{t("network")}
			</div>
			<div className="bep">
				<ButtonCustom
					style={{ width: '50%' }}
					type={buttonType.active}
				>
					BEP20 (BSC)
				</ButtonCustom>
			</div>
			<div className="note">
				<AlertCustom>
					<span>
						{t('note')}:
					</span>
					{" "}
					{t('forTheSafetyOfYourFundsPleaseConfirmAgainThatTheBlockchainYouWishToUseIsBSC')}
				</AlertCustom>
			</div>
			<div className="address">
				<div className="title">
					{t('yourUSDTDepositingAddress')}
				</div>
				<div className="qr">
					<QRCode
						size={256}
						style={{ height: "auto", maxWidth: "100%", width: "100%" }}
						value={`0x7E1FdF03Eb3aC35BF0256694D7fBe6B6d7b3E0c8`}
						viewBox={`0 0 256 256`}
					/>
				</div>
				<div className="input">
					<input
						type="text"
						value={`0x7E1FdF03Eb3aC35BF0256694D7fBe6B6d7b3E0c8`}
						disabled
					/>
				</div>
				<div className="minimum">
					{t('minimumAmount5USDT')}
				</div>
				<div className="copy">
					<ButtonCustom
						style={{
							maxWidth: '230px',
							width: '100%',
							padding: '11px 15px'
						}}
						type={buttonType.shineGreen}
					>
						{t('copy')}
					</ButtonCustom>
				</div>
			</div>


		</div>
	)
}

export default WalletNewDeposit;
