import React, { useContext, useState } from "react";
import ButtonCustom, { buttonType } from './ButtonCustom';
import Transfer from '../assets/icons/transfer.icon';
import Rotate from '../assets/icons/rotate.icon';
import { Drilling } from "../context/drilling";
import ModalCustom from './ModalCustom';
import TradeWalletModalContent from "./TradeWalletModalContent";
import useMediaQuery, { widthDevice } from '../hooks/useMedia';
import { useTranslation } from "react-i18next";

function TradeWallet() {
	// đa ngôn ngữ 
	const { t } = useTranslation();

	// show balance
	let context = {}
	context = useContext(Drilling);
	const { showBalance } = context
	const renderBalance = (value) => {
		return showBalance ? (
			value
		) : (
			<div className="amount-hide">
				******
			</div>
		)
	}

	// modal 
	const [modalShow, setModalShow] = useState(false);
	const modalOpen = () => setModalShow(true);
	const modalClose = () => setModalShow(false);

	//responsive
	const screen = useMediaQuery();
	let accountName = t('liveAccount')
	if (screen === widthDevice.width_576) {
		accountName = 'Live account'
	}

	return (
		<>
			<div className="trade-wallet">
				<div className="row">
					<div className="item">
						<div className="name">
							{accountName}
						</div>
						{renderBalance(
							<div className="amount">
								$0
							</div>
						)}
						<div className="action">
							<ButtonCustom
								type={buttonType.active}
								style={{
									border: 0
								}}
								onClick={modalOpen}
							>
								<Transfer />
								<span>
									Chuyển Tiền
									{t('')}
								</span>
							</ButtonCustom>
						</div>
					</div>
					<div className="item">
						<div className="name">
							{t('demoAccount')}
						</div>
						{renderBalance(
							<div className="amount">
								$1,000
							</div>
						)}
						<div className="action">
							<ButtonCustom
								type={buttonType.active}
								style={{
									border: 0
								}}
							>
								<Rotate />
								<span>
									{t('refillBalance')}
								</span>
							</ButtonCustom>
						</div>
					</div>
				</div>
				<div className="history">
					<div className="title">
						{t('transactionHistory')}
					</div>
					<div className="content">
						{t('nodata')}
					</div>
				</div>
			</div>
			<ModalCustom
				animation={true}
				closeOnOverlay={true}
				show={modalShow}
				closeModal={modalClose}
				classNameContainer={`trade-wallet-modal`}
			>
				<TradeWalletModalContent />
			</ModalCustom >
		</>
	);
}

export default TradeWallet;