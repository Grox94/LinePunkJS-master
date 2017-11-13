-const LineAPI = require('./api');
const { Message, OpType, Location } = require('../curve-thrift/line_types');
let exec = require('child_process').exec;

//Please Replce all like LOCKUPDATEGROUP But MSG AND UNMUTE/MUTE Leave them as they Are~//
var myBott = ['ufd9feaa98e1074c0af5f39d8dde403eb'];//TARO MID LU DISINI SUPAYA BISA PKE COMMAND STAFF

const myBot = ['ufd9feaa98e1074c0af5f39d8dde403eb'];//TARO MID LU DISINI
var vx = {};var midnornama = "";var pesane = "";var kickhim = "";var waitMsg = "no";//DO NOT CHANGE THIS

function isAdminOrBot(param) {
    return myBot.includes(param);
}

function isStaffOrBot(param) {
    return myBott.includes(param);
}

function firstToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function isTGet(string,param){
	return string.includes(param);
}


class LINE extends LineAPI {
    constructor() {
        super();
        this.receiverID = '';
        this.checkReader = [];
        this.sendStaff = 0;
        this.stateStatus = {
            mute: 0,
            lockinvite: 0,
            lockupdategroup: 0,
            lockjoin: 0,
            lockcancel: 1,
            kick:1,
            cancel: 1,
            bc: 0,
            bmsg: 1,
        }
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }


    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
            const txt = (operation.message.text !== '' && operation.message.text != null ) ? operation.message.text : '' ;
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === myBot[0]) ? operation.message.from : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            if(waitMsg == "yes" && operation.message.from == vx[0] && this.stateStatus.mute != 1){
				this.textMessage(txt,message,message.text)
			}else if(this.stateStatus.mute != 1){this.textMessage(txt,message);
			}else if(txt == "Unmute" && isAdminOrBot(operation.message.from) && this.stateStatus.mute == 1){
			    this.stateStatus.mute = 0;
			    this._sendMessage(message,"ヽ(^。^)ノ")
		    }else{console.info("Bot Off");}
        }

        if(operation.type == 13 && this.stateStatus.cancel == 1) {
            if(!isAdminOrBot(operation.param2) && !isStaffOrBot(operation.param2)) {
            this.cancelAll(operation.param1);
            }

        }

        if(operation.type == 13 && this.stateStatus.lockinvite == 1) {
            if(!isAdminOrBot(operation.param2) && !isStaffOrBot(operation.param2)) {
            this._kickMember(operation.param1,[operation.param2]);
             }

           }

		if(operation.type == 11 && this.stateStatus.lockupdategroup == 1 && !isAdminOrBot(operation.param2) && !isStaffOrBot(operation.param2)){//update group (open qr)
		    let seq = new Message();
			seq.to = operation.param1;
			this.textMessage("0103",seq,operation.param2,1);
		}else if(operation.type == 11 && this.stateStatus.lockupdategroup == 1 && !isAdminOrBot(operation.param2) && !isStaffOrBot(operation.param2)){
			let seq = new Message();
			seq.to = operation.param1;
	     this.textMessage("0104",seq,operation.param2,1);
		}else if(operation.type == 11 && this.stateStatus.lockupdategroup == 0 && !isAdminOrBot(operation.param2) && !isStaffOrBot(operation.param2)){
			let seq = new Message();
			seq.to = operation.param1;
	    this.textMessage("0103",seq,operation.param2,1);
		}

           if(operation.type == 11 && this.stateStatus.lockupdategroup == 1) { //ada update
           // op1 = group nya
           // op2 = yang 'nge' update
           if(!isAdminOrBot(operation.param2) && !isStaffOrBot(operation.param2)) {
              this._kickMember(operation.param1,[operation.param2]);
             }

           }

          if(operation.type == 15 && this.stateStatus.bmsg == 1) {
             let out = new Message();
             out.to = operation.param1;

             out.text = "Do YOGA every day .-."
			     this._client.sendMessage(0, out);
            }

            if(operation.type == 17 && this.stateStatus.bmsg == 1) {

               let kam = new Message();
               kam.to = operation.param1;
               kam.text = "Welcome ^_^"
               this._client.sendMessage(0, kam);
             }

           if(operation.type == 16 && this.stateStatus.bmsg == 1) {
             let itil = new Message();
             itil.to = operation.param1;
             itil.text = "Thank You:) ^_^\n\nPlease type [Grox Help] To Know Our Command Bot.\n\n-Vix Bot-"
             this._client.sendMessage(0, itil);
           }

           if(operation.type == 19 && this.stateStatus.bmsg == 1 && !isAdminOrBot(operation.param2)) {
             let plerrr = new Message();
             plerrr.to = operation.param1;
             plerrr.text = "Ouch Kick_-"
             this._client.sendMessage(0, plerrr);
           }

           if(operation.type == 17 && this.stateStatus.lockjoin == 1) {
            if(!isAdminOrBot(operation.param2) || !isStaffOrBot(operation.param2)) {
            this._kickMember(operation.param1,[operation.param2]);
             }

           }

           if(operation.type == 19 && this.stateStatus.kick == 1) { //ada kick
            // op1 = group nya
            // op2 = yang 'nge' kick
            // op3 = yang 'di' kick
            if(isAdminOrBot(operation.param3) && isStaffOrBot(operation.param3)) {
               this._invite(operation.param1,[operation.param3]);
            }
            if(!isAdminOrBot(operation.param2) && !isStaffOrBot(operation.param2)) {
               this._kickMember(operation.param1,[operation.param2]);
            }

        }

        if(operation.type == 32 && this.stateStatus.lockcancel == 1) { //ada cancel
          // op1 = group nya
          // op2 = yang 'nge' cancel
          // op3 = yang 'di' cancel
          if(isAdminOrBot(operation.param3) && isStaffOrBot(operation.param3)) {
              this._invite(operation.param1,[operation.param3]);
          }
          if(!isAdminOrBot(operation.param2) && !isStaffOrBot(operation.param2)) {
              this._kickMember(operation.param1,[operation.param2]);
            }

        }

        if(operation.type == 55){ //ada reader

            const idx = this.checkReader.findIndex((v) => {
                if(v.group == operation.param1) {
                    return v
                }
            })
            if(this.checkReader.length < 1 || idx == -1) {
                this.checkReader.push({ group: operation.param1, users: [operation.param2], timeSeen: [operation.param3] });
            } else {
                for (var i = 0; i < this.checkReader.length; i++) {
                    if(this.checkReader[i].group == operation.param1) {
                        if(!this.checkReader[i].users.includes(operation.param2)) {
                            this.checkReader[i].users.push(operation.param2);
                            this.checkReader[i].timeSeen.push(operation.param3);
                        }
                    }
                }
            }
        }

        if(operation.type == 13) { // diinvite
            if(isAdminOrBot(operation.param2)) {
                return this._acceptGroupInvitation(operation.param1);
            } else {
                return this._cancel(operation.param1,myBot);
            }
        }
        this.getOprationType(operation);
    }

    async cancelAll(gid) {
        let { listPendingInvite } = await this.searchGroup(gid);
        if(listPendingInvite.length > 0){
            this._cancel(gid,listPendingInvite);
        }
    }

    async searchGroup(gid) {
        let listPendingInvite = [];
        let thisgroup = await this._getGroups([gid]);
        if(thisgroup[0].invitee !== null) {
            listPendingInvite = thisgroup[0].invitee.map((key) => {
                return key.mid;
            });
        }
        let listMember = thisgroup[0].members.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });

        return {
            listMember,
            listPendingInvite
        }
    }

    setState(seq,param) {
		if(param == 1){
			let isinya = "Setting\n";
			for (var k in this.stateStatus){
                if (typeof this.stateStatus[k] !== 'function') {
					if(this.stateStatus[k]==1){
						isinya += " "+firstToUpperCase(k)+" => on\n";
					}else{
						isinya += " "+firstToUpperCase(k)+" => off\n";
					}
                }
            }this._sendMessage(seq,isinya);
		}else{
        if(isAdminOrBot(seq.from) || isStaffOrBot(seq.from)){
            let [ actions , status ] = seq.text.split(' ');
            const action = actions.toLowerCase();
            const state = status.toLowerCase() == 'on' ? 1 : 0;
            this.stateStatus[action] = state;
			let isinya = "Setting\n";
			for (var k in this.stateStatus){
                if (typeof this.stateStatus[k] !== 'function') {
					if(this.stateStatus[k]==1){
						isinya += " "+firstToUpperCase(k)+" => on\n";
					}else{
						isinya += " "+firstToUpperCase(k)+" => off\n";
					}
                }
            }
            //this._sendMessage(seq,`Status: \n${JSON.stringify(this.stateStatus)}`);
			this._sendMessage(seq,isinya);
        } else {
            this._sendMessage(seq,`Sorry your not Staff Or Admin~`);
        }}
    }

    mention(listMember) {
        let mentionStrings = [''];
        let mid = [''];
        for (var i = 0; i < listMember.length; i++) {
            mentionStrings.push('@'+listMember[i].displayName+'\n');
            mid.push(listMember[i].mid);
        }
        let strings = mentionStrings.join('');
        let member = strings.split('@').slice(1);

        let tmp = 0;
        let memberStart = [];
        let mentionMember = member.map((v,k) => {
            let z = tmp += v.length + 1;
            let end = z - 1;
            memberStart.push(end);
            let mentionz = `{"S":"${(isNaN(memberStart[k - 1] + 1) ? 0 : memberStart[k - 1] + 1 ) }","E":"${end}","M":"${mid[k + 1]}"}`;
            return mentionz;
        })
        return {
            names: mentionStrings.slice(1),
            cmddata: { MENTION: `{"MENTIONEES":[${mentionMember}]}` }
        }
    }

    async leftGroupByName(payload) {
        let gid = await this._findGroupByName(payload);
        for (var i = 0; i < gid.length; i++) {
            this._leaveGroup(gid[i]);
        }
    }

    async recheck(cs,group) {
        let users;
        for (var i = 0; i < cs.length; i++) {
            if(cs[i].group == group) {
                users = cs[i].users;
            }
        }

        let contactMember = await this._getContacts(users);
        return contactMember.map((z) => {
                return { displayName: z.displayName, mid: z.mid };
            });
    }

    removeReaderByGroup(groupID) {
        const groupIndex = this.checkReader.findIndex(v => {
            if(v.group == groupID) {
                return v
            }
        })

        if(groupIndex != -1) {
            this.checkReader.splice(groupIndex,1);
        }
    }

    async textMessage(textMessages, seq, param, lockt) {
        let [ cmd, ...payload ] = textMessages.split(' ');
        payload = payload.join(' ');
        let txt = textMessages.toLowerCase();
        let messageID = seq.id;

        const ginfo =  await this._getGroup(seq.to);
        const groupCreator = ('[ginfo.creator.mid]');
        const cot = textMessages.split('@');
        const com = textMessages.split(':');
        const cox = textMessages.split(' ');


        if(cmd == 'cancel') {
            if(payload == 'group') {
                let groupid = await this._getGroupsInvited();

                for (let i = 0; i < groupid.length; i++) {
                    this._rejectGroupInvitation(groupid[i])
                }
                return;
            }
            if(this.stateStatus.cancel == 1) {
                this.cancelAll(seq.to);
            }
        }

		if(vx[1] == "msg" && seq.from == vx[0] && waitMsg == "yes"){
			let panjang = txt.split("");
			if(txt == "cancel"){
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}else if(vx[2] == "arg1" && vx[3] == "mid" && cot[1]){
				let bang = new Message();bang.to = seq.to;
				bang.text = "OK !, btw what msg ?"
				this._client.sendMessage(0,bang);
				let ment = seq.contentMetadata.MENTION;
			    let xment = JSON.parse(ment);let pment = xment.MENTIONEES[0].M;
				let midnya = JSON.stringify(pment);
				vx[4] = midnya;
				vx[2] = "arg2";
			}else if(vx[2] == "arg1" && vx[3] == "mid" && seq.contentType == 13){
				let midnya = seq.contentMetadata.mid;let bang = new Message();bang.to = seq.to;
				bang.text = "OK !, btw what msg ?"
				this._client.sendMessage(0,bang);
				vx[4] = midnya;
				vx[2] = "arg2";
			}else if(vx[2] == "arg1" && vx[3] == "mid" && panjang.length > 30){
				this._sendMessage(seq,"OK !, Btw What Msg ?");
				vx[4] = txt;
				vx[2] = "arg2";
			}else if(vx[2] == "arg2" && vx[3] == "mid"){
				let panjangs = vx[4].split("");
				let kirim = new Message();let bang = new Message();
				bang.to = seq.to;
				if(panjangs[0] == "u"){
					kirim.toType = 0;
				}else if(panjangs[0] == "c"){
					kirim.toType = 2;
				}else if(panjangs[0] == "r"){
					kirim.toType = 1;
				}else{
					kirim.toType = 0;
				}
				bang.text = "Sent bang !";
				kirim.to = vx[4];
				kirim.text = txt;
				vx[0] = "";vx[1] = "";waitMsg = "no";vx[2] = "";vx[3] = "";vx[4] = "";
				this._client.sendMessage(0, kirim);
				this._client.sendMessage(0, bang);
			}else{
				this._sendMessage(seq,"# How to !msg\nTag / Send Contact / Send a Mid !");
			}
		}if(txt == "msg" && isStaffOrBot(seq.from)) {
			if(vx[2] == null || typeof vx[2] === "undefined" || !vx[2]){
			    waitMsg = "yes";
			    vx[0] = seq.from;vx[1] = txt;vx[3] = "mid";
			    this._sendMessage(seq,"To whom you want to send?");
				this._sendMessage(seq,"Tag / Send Contact / Send a Mid !");
				vx[2] = "arg1";
			}else{
				waitMsg = "no";vx[0] = "";vx[1] = "";vx[2] = "";vx[3] = "";
				this._sendMessage(seq,"#CANCELLED");
			}
		} if(txt == "msg" && !isStaffOrBot(seq.from)){
            this._sendMessage(seq,"Sorry You Are Not An Admin Or Staff~");
      }

		if(txt == '0103' && lockt == 1){
			let ax = await this._client.getGroup(seq.to);
			if(ax.preventJoinByTicket === true){}else{ax.preventJoinByTicket = true;await this._client.updateGroup(0, ax);}
		}
		if(txt == '0104' && lockt == 1){
			let ax = await this._client.getGroup(seq.to);
			if(ax.preventJoinByTicket === true){ax.preventJoinByTicket = false;await this._client.updateGroup(0, ax);}else{}
		}

      if(txt == 'grox:add:staff' && this.sendStaff == 0 && isAdminOrBot(seq.from)){
         this.sendStaff = 1;
         this._sendMessage(seq,'Please send Contact~')
       }

       if(seq.contentType == 13 && this.sendStaff == 1 && isAdminOrBot(seq.from)) {
          seq.contentType = 0;
          this.sendStaff = 0;
          myBott.push(seq.contentMetadata.mid);
          this._sendMessage(seq,'Added as Staff :'+'\n'+seq.contentMetadata.displayName);
        }

        if(txt == 'grox:del:staff' && this.sendStaff == 0 && isAdminOrBot(seq.from))
{
           this.sendStaff = 2;
           this._sendMessage(seq,'Send A Contact To Remove Staff~')
           }

           if(seq.contentType == 13 && this.sendStaff == 2 && isAdminOrBot(seq.from))
{
              if(!isStaffOrBot(seq.contentMetadata.mid)) {
                 seq.contentType = 0;
                 this.sendStaff = 0;
                 await this._sendMessage(seq,'Not a staff~');
       }
     else
       {
            seq.contentType = 0;
            while (myBott[myBott.indexOf(seq.contentMetadata.mid)])
        {
            delete myBott[myBott.indexOf(seq.contentMetadata.mid)];
        }
    this.sendStaff = 0;
    await this._sendMessage(seq,'successfully removed staff~');
    }
}

        if(txt == 'grox:infogroup') {
           this._sendMessage(seq, 'Group Name :\n'+ginfo.name+'\n\nGroup ID :\n'+ginfo.id+'\n\nGroup Creator :\n'+ginfo.creator.displayName);
         }

        if(txt == 'Responsename') {
           if(isAdminOrBot(seq.from) || isStaffOrBot(seq.from)) {
            this._sendMessage(seq, 'Grox 􀂳');
           }
        }

        if(txt == 'grox help') {
           this._sendMessage(seq, '==============================\ntαв αll cσmmαnd\n==============================\n☞ Myid\n☞ gx gift\n☞ Hello\n☞ Grox Help\n☞ Creator Bot\n☞ Bc [Amount] /[Text] (If Bc On)\n☞ Grox:InfoGroup\n☞ Group Creator\n☞ Tag\n☞ Test Speed\n☞ lurklurker\n☞ Grox DLlurkers\n☞ Status/Settings\n☞ Grox lurkers\n☞ Admin Rights And Staff\n\n==============================\nGrox ѕтαff ¢σммαи∂\n==============================\n☞ Responsename\n☞ Open Url\n☞ Close Url\n☞ Grox @Bye\n☞ spam\n☞ Kick On/Off\n☞ Cancel On/Off\n☞ LockInvite On/Off\n☞ LockUpdateGroup On/Off\n☞ LockJoin On/Off\n☞ LockCancel On/Off\n☞ Nk「@」\n☞ Kickall (Kick On Terlebih Dahulu)\n☞ Msg\n☞ Bc On/Off\n☞ Bmsg On/Off\n\n==============================\nтαв α∂мιи ¢σммαи∂\n==============================\n☞ Mute\n☞ Unmute\n☞ Grox:add:staff\n☞ Grox:del:staff\n\n==============================฿Ɏ ₮Ɇ₳₥ ₳₦Ʉ ฿Ø₮\n==============================');
        }

         if(txt == 'Admin Rights And Staff' || txt == 'Admin Rights And Staff') {
            this._sendMessage(seq, 'Staff cmds are only for staff, Staff cant use Admin cmds nor can inv in grps\n\nAdmin can use all cmds including staff cmds, (Inv in limited grps)\n\n-Vix Bot-');
         }

         if(txt == 'status') {
            this._sendMessage(seq,`Status: \n${JSON.stringify(this.stateStatus)}\n\n*Note: If Status Shows 0 That Means Off And If Status Indicates 1 That Means On\n\n-Vix Bot-`);
          }

		if(txt == "Settings"){
			this.setState(seq,1)
		}

        //if(txt == 'admin') {
            //this._sendMessage(seq, 'Here Is My Admin :\n\n(1.) Vix\nId Line : http://line.me/ti/p/~Vix121-');
        //}

        if(txt == 'noob') {

           seq.contentType = 7
           seq.contentMetadata = {'STKID':'404','STKPKGID':'1','STKVER':'100'};
           this._client.sendMessage(3, seq);
          }

          if(txt == 'gx gift') {
             seq.contentType = 9
             seq.contentMetadata = {'PRDID': 'a0768339-c2d3-4189-9653-2909e9bb6f58','PRDTYPE': 'THEME','MSGTPL': '5'};
             this._client.sendMessage(1, seq);
          }

        if(txt == 'hello') {
          if(isAdminOrBot(seq.from) || isStaffOrBot(seq.from)) {
        this._sendMessage(seq, 'Hello there');
        }
      else
        {
         this._sendMessage(seq, 'Yo Yo,Sup~');
         }
     }



        if(txt == 'test speed') {
            const curTime = (Date.now() / 1000);

            await this._sendMessage(seq,'testing speed....');


            const rtime = (Date.now() / 1000) - curTime;
            await this._sendMessage(seq, `${rtime} second`);
        }

        if(txt == 'tag') {
let { listMember } = await this.searchGroup(seq.to);
     const mentions = await this.mention(listMember);
        seq.contentMetadata = mentions.cmddata; await this._sendMessage(seq,mentions.names.join(''))
        }

        if(txt === 'kernelo') {
            exec('uname -a;ptime;id;whoami',(err, sto) => {
                this._sendMessage(seq, sto);
            })
        }

        if(txt === 'kickall' && this.stateStatus.kick == 1 && isStaffOrBot(seq.from)) {
            let { listMember } = await this.searchGroup(seq.to);
            for (var i = 0; i < listMember.length; i++) {
                if(!isAdminOrBot(listMember[i].mid)){
                    this._kickMember(seq.to,[listMember[i].mid])
                }
            }
        }

        if(txt == 'lurklurker') {
            this._sendMessage(seq, `Lurking on... .`);
            this.removeReaderByGroup(seq.to);
        }

        if(txt == 'grox dLlurkers') {

            this.checkReader = []
            this._sendMessage(seq, `Deleting lurkers data...`);
        }


        if(txt == 'grox lurkers') {
            let rec = await this.recheck(this.checkReader,seq.to);
            const mentions = await this.mention(rec);
            seq.contentMetadata = mentions.cmddata;
            await this._sendMessage(seq,mentions.names.join(''));

        }

         if (txt == 'group creator') {
             let gcreator = await this._getGroup(seq.to);
             seq.contentType = 13;
             seq.contentMetadata = {mid: gcreator.creator.mid, displayName: gcreator.creator.displayName};
             this._client.sendMessage(1, seq);
         }

        if(txt == 'bot creator') {
           this._sendMessage(seq, 'My Creator Is Vix\nId Line : http://line.me/ti/p/~Vix121\n\n-Vix вσт-');
           seq.contentType=13;
           seq.contentMetadata = { mid: 'ufd9feaa98e1074c0af5f39d8dde403eb' };
           this._client.sendMessage(1, seq);
        }

        //if(seq.contentType == 13) {
            //seq.contentType = 0
            //this._sendMessage(seq,seq.contentMetadata.mid);
        //}


        if(txt == 'setpoint for check reader .') {
            this.searchReader(seq);
        }

        if(txt == 'clearall') {
            this.checkReader = [];
        }

		if(txt == "mute" && isAdminOrBot(seq.from)) {
			this.stateStatus.mute = 1;
			this._sendMessage(seq,"Shhhh")
		}

        const action = ['lockinvite on','lockinvite off','lockupdategroup on','lockupdategroup off','lockjoin on','lockjoin off','lockcancel on','lockcancel off','kick on','kick off','cancel on','cancel off','bc on','bc off','bmsg on','bmsg off']
        if(action.includes(txt)) {
            this.setState(seq)
        }

        if(txt == 'myid') {
            this._sendMessage(seq,`MID Anda : ${seq.from}`);
        }

        const joinByUrl = ['open url','close url'];
        if(joinByUrl.includes(txt) && isStaffOrBot(seq.from)) {
            this._sendMessage(seq,`Wait a min ...`);
            let updateGroup = await this._getGroup(seq.to);
            updateGroup.preventJoinByTicket = true;
            if(txt == 'open url') {
                updateGroup.preventJoinByTicket = false;
                const groupUrl = await this._reissueGroupTicket(seq.to)
                this._sendMessage(seq,`Link Group = line://ti/g/${groupUrl}`);
            }
            await this._updateGroup(updateGroup);
        }

        if(cmd == 'join') { //untuk join group pake qrcode contoh: join line://anu/g/anu
            const [ ticketId ] = payload.split('g/').splice(-1);
            let { id } = await this._findGroupByTicket(ticketId);
            await this._acceptGroupInvitationByTicket(id,ticketId);
        }

        if(cmd == 'Nk' && isStaffOrBot(seq.from)){
           let target = payload.replace('@','');
           let group = await this._getGroups([seq.to]);
           let gm = group[0].members;
              for(var i = 0; i < gm.length; i++){
                     if(gm[i].displayName == target){
                                  target = gm[i].mid;
                     }
               }

               this._kickMember(seq.to,[target]);
        }

               if(cmd == 'bc' || cmd == 'Bc' && this.stateStatus.bc == 1) {
                  const [  j, words ] = payload.split('/');
                  for (var i=0; i <j; i++) {
                  this._sendMessage(seq,`${words}`);
                }
          }

        if(cmd == 'spam' && isStaffOrBot(seq.from)) {
            for(var i= 0; i < 10;  i++) {
               this._sendMessage(seq, 'Love You~');
        }
    }

        if(cmd == 'spm' && isAdminOrBot(seq.from)) { // untuk spam invite contoh: spm <mid>
            for (var i = 0; i < 100; i++) {
                this._createGroup(`Pikachu`,payload);
            }
        }

        if(txt == 'grox @bye') {
           if(isAdminOrBot(seq.from) || isStaffOrBot(seq.from)){
          let txt = await this._sendMessage(seq, 'See you:) (GROX) Had a good with you all Bye Tc~');
          this._leaveGroup(seq.to);
        }
    }

        if(cmd == 'lirik') {
            let lyrics = await this._searchLyrics(payload);
            this._sendMessage(seq,lyrics);
        }

        if(cmd === 'ip') {
            exec(`curl ipinfo.io/${payload}`,(err, res) => {
                const result = JSON.parse(res);
                if(typeof result.error == 'undefined') {
                    const { org, country, loc, city, region } = result;
                    try {
                        const [latitude, longitude ] = loc.split(',');
                        let location = new Location();
                        Object.assign(location,{
                            title: `Location:`,
                            address: `${org} ${city} [ ${region} ]\n${payload}`,
                            latitude: latitude,
                            longitude: longitude,
                            phone: null
                        })
                        const Obj = {
                            text: 'Location',
                            location : location,
                            contentType: 0,
                        }
                        Object.assign(seq,Obj)
                        this._sendMessage(seq,'Location');
                    } catch (err) {
                        this._sendMessage(seq,'Not Found');
                    }
                } else {
                    this._sendMessage(seq,'Location Not Found ,');

                }
            })
        }
    }

}

module.exports = new LINE();
