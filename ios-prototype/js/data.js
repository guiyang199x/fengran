/**
 * Mock data layer for the FENGRAN (锋燃) iOS prototype.
 * Exercise records are real entries sampled from the hasaneyldrm/exercises-dataset
 * data/exercises.json; names, targets, equipment and step-by-step instructions
 * are unmodified source data. Media (image/gif) is hotlinked from that same
 * repository, see the licensing note in the root README. Plans / logs /
 * community / coach content is fabricated for demo purposes only, clearly
 * scoped to this prototype.
 */

const BODY_PART_LABEL = {
  chest: "胸部",
  back: "背部",
  "upper legs": "大腿",
  "lower legs": "小腿",
  shoulders: "肩部",
  "upper arms": "上臂",
  "lower arms": "前臂",
  waist: "腹部",
  cardio: "有氧",
  neck: "颈部",
};

const EQUIPMENT_LABEL = {
  "body weight": "自重",
  dumbbell: "哑铃",
  barbell: "杠铃",
  cable: "绳索",
  band: "弹力带",
  "leverage machine": "杠杆器械",
  "smith machine": "史密斯架",
  assisted: "辅助器械",
  weighted: "负重",
  roller: "泡沫轴",
  rope: "绳索",
  "stepmill machine": "爬梯机",
};

function equipmentLabel(eq) {
  return EQUIPMENT_LABEL[eq] || eq;
}

const EXERCISES = [
  { id: "0009", name: "跪姿助力夹胸下压", en: "assisted chest dip (kneeling)", body_part: "chest", equipment: "leverage machine", target: "胸大肌", muscle_group: "三头肌", secondary_muscles: ["三头肌", "肩部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0009-PAgTVaK.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0009-PAgTVaK.gif", steps: ["将机器调整到您想要的高度，并将膝盖固定在垫子上。","手掌朝下，抓住手柄，双臂完全伸展。","弯曲肘部降低身体，直到上臂与地板平行。","暂停片刻，然后将自己推回到起始位置。","重复所需的重复次数。"] },
  { id: "0375", name: "哑铃俯身拉举", en: "dumbbell pullover", body_part: "chest", equipment: "dumbbell", target: "胸大肌", muscle_group: "背阔肌", secondary_muscles: ["背阔肌", "三头肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0375-9XjtHvS.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0375-9XjtHvS.gif", steps: ["平躺在长凳上，头放在一端，双脚放在地板上。","双手握住哑铃，将手臂伸直至胸部上方。","保持肘部轻微弯曲，慢慢地将哑铃放到脑后，直到感觉胸部和肩膀有拉伸感。","暂停片刻，然后将哑铃举回到起始位置。","重复所需的重复次数。"] },
  { id: "1259", name: "颈后胸部拉伸", en: "behind head chest stretch", body_part: "chest", equipment: "assisted", target: "胸大肌", muscle_group: "肩部", secondary_muscles: ["肩部", "三头肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1259-QoHIhPl.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1259-QoHIhPl.gif", steps: ["站直，双脚分开与肩同宽。","将手指交叉放在脑后，肘部朝外。","慢慢地将肩胛骨挤压在一起，并将胸部向前推。","保持拉伸 15-30 秒。","松开拉伸并根据需要重复。"] },
  { id: "1299", name: "杠杆上斜推胸", en: "lever incline chest press", body_part: "chest", equipment: "leverage machine", target: "胸大肌", muscle_group: "肩部", secondary_muscles: ["肩部", "三头肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1299-jHAnWmT.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1299-jHAnWmT.gif", steps: ["将杠杆机的座椅和靠背调整到舒适的位置。","坐在机器上，背部靠在靠背上，双脚平放在地板上。","正手握住手柄，双手之间的距离略大于肩宽。","向前推动手柄并使其远离身体，直到双臂完全伸展。","暂停片刻，然后慢慢弯曲肘部，将手柄放回到胸部。","重复所需的重复次数。"] },
  { id: "0007", name: "交替下拉背肌", en: "alternate lateral pulldown", body_part: "back", equipment: "cable", target: "背阔肌", muscle_group: "二头肌", secondary_muscles: ["二头肌", "菱形肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0007-4IKbhHV.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0007-4IKbhHV.gif", steps: ["坐在缆绳机上，背部挺直，双脚平放在地面上。","正手握住手柄，握距略宽于肩宽。","稍微向后倾斜，将手柄拉向胸部，将肩胛骨挤压在一起。","在动作的最高点暂停片刻，然后慢慢松开手柄回到起始位置。","重复所需的重复次数。"] },
  { id: "0489", name: "山羊挺身", en: "hyperextension", body_part: "back", equipment: "body weight", target: "脊柱", muscle_group: "臀大肌", secondary_muscles: ["臀大肌", "腘绳肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0489-zhMwOwE.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0489-zhMwOwE.gif", steps: ["调整过伸凳，使大腿上部放在垫子上并且双脚固定。","双臂交叉放在胸前或将双手放在脑后。","将上半身压向地面，同时保持背部挺直。","在底部停顿片刻，然后抬起上半身，直到与双腿成一直线。","重复所需的重复次数。"] },
  { id: "1018", name: "弹力带耸肩", en: "band shrug", body_part: "back", equipment: "band", target: "斜方肌", muscle_group: "肩部", secondary_muscles: ["肩部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1018-trmte8s.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1018-trmte8s.gif", steps: ["双脚分开与肩同宽站立，将弹力带放在脚下，用手握住两端。","保持手臂伸直并放松，让弹力带悬挂在大腿前面。","向上耸肩，尽可能高地举起弹力带，以启动斜方肌。","保持收缩一会儿，然后慢慢将肩膀放回起始位置。","重复所需的重复次数。"] },
  { id: "1366", name: "上犬式", en: "upward facing dog", body_part: "back", equipment: "body weight", target: "脊柱", muscle_group: "肩部", secondary_muscles: ["肩部", "胸部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1366-01qpYSe.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1366-01qpYSe.gif", steps: ["脸朝下躺在地板上，双腿伸到身后。","将双手放在下肋骨旁边的地板上，手指指向前方。","双手用力按在地板上，伸直手臂，将躯干和大腿抬离地面。","向后和向下转动肩膀，打开胸部，将目光转向天花板。","保持这个姿势几次呼吸，然后慢慢将身体放回起始位置。","重复所需的重复次数。"] },
  { id: "0016", name: "辅助俯卧腿弯举", en: "assisted prone hamstring", body_part: "upper legs", equipment: "assisted", target: "腘绳肌", muscle_group: "臀大肌", secondary_muscles: ["臀大肌", "下背部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0016-VedGSby.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0016-VedGSby.gif", steps: ["脸朝下躺在垫子或长凳上，双腿完全伸展。","找一个伙伴或使用阻力带来固定脚踝。","收紧腘绳肌，将双腿抬向臀肌，保持膝盖伸直。","在顶部暂停片刻，然后慢慢将双腿放回起始位置。","重复所需的重复次数。"] },
  { id: "0513", name: "跳跃深蹲", en: "jump squat v. 2", body_part: "upper legs", equipment: "body weight", target: "臀大肌", muscle_group: "股四头肌", secondary_muscles: ["股四头肌", "腘绳肌", "小腿"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0513-TDYiji6.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0513-TDYiji6.gif", steps: ["双脚分开与肩同宽站立。","弯曲膝盖并将臀部向后推，将身体降低至蹲姿。","爆发力跳跃，充分伸展臀部和膝盖。","脚掌轻轻着地，然后立即将身体放回蹲姿。","重复所需的重复次数。"] },
  { id: "1001", name: "弹力带单腿分蹲", en: "band single leg split squat", body_part: "upper legs", equipment: "band", target: "股四头肌", muscle_group: "臀大肌", secondary_muscles: ["臀大肌", "腘绳肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1001-y8bYM8w.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1001-y8bYM8w.gif", steps: ["双脚分开站立，与臀部同宽，将阻力带绕在脚踝上。","右脚向前迈一大步，左脚向后退一小步。","弯曲膝盖并降低身体，直到右大腿与地面平行，保持左膝盖略高于地面。","推动右脚跟回到起始位置。","在另一侧重复。"] },
  { id: "1757", name: "哑铃单腿硬拉", en: "dumbbell single leg deadlift", body_part: "upper legs", equipment: "dumbbell", target: "臀大肌", muscle_group: "腘绳肌", secondary_muscles: ["腘绳肌", "下背部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1757-gKozT8X.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1757-gKozT8X.gif", steps: ["双脚分开与臀部同宽站立，右手握住哑铃。","将体重转移到左腿上，并将右脚稍微抬离地面。","保持背部挺直，臀部向前转动，将哑铃放低至地面。","同时，将右腿伸直在身后，保持左膝轻微弯曲。","降低哑铃，直到躯干和右腿与地面平行。","暂停片刻，然后收紧臀肌和腘绳肌，回到起始位置。","重复所需的重复次数，然后换边。"] },
  { id: "0088", name: "杠铃坐姿提踵", en: "barbell seated calf raise", body_part: "lower legs", equipment: "barbell", target: "小腿肌", muscle_group: "腘绳肌", secondary_muscles: ["腘绳肌", "股四头肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0088-ktsFQAZ.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0088-ktsFQAZ.gif", steps: ["坐在长凳上，双脚平放在地板上，杠铃放在大腿上。","将脚掌放在升高的平台上，例如木块或台阶。","将杠铃放在大腿上，并用手牢牢握住它。","保持背部挺直，核心收紧，伸展脚踝，将脚后跟抬离地面。","在顶部停顿片刻，然后慢慢降低脚后跟回到起始位置。","重复所需的重复次数。"] },
  { id: "1378", name: "绳索拉伸小腿", en: "calf stretch with rope", body_part: "lower legs", equipment: "rope", target: "小腿肌", muscle_group: "腘绳肌", secondary_muscles: ["腘绳肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1378-1LVFcEn.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1378-1LVFcEn.gif", steps: ["面向墙壁或坚固物体站立，双脚分开与臀部同宽。","双手握住绳子的两端，将绳子的中间放在右脚掌周围。","左脚向后退一步，脚跟保持在地面上，腿伸直。","身体前倾，保持背部挺直，轻轻拉动绳子以伸展小腿。","保持拉伸 20-30 秒，然后放松。","在另一条腿上重复。"] },
  { id: "0041", name: "杠铃前平举", en: "barbell front raise", body_part: "shoulders", equipment: "barbell", target: "三角肌", muscle_group: "二头肌", secondary_muscles: ["二头肌", "三头肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0041-b2Uoz54.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0041-b2Uoz54.gif", steps: ["双脚分开与肩同宽站立，正手握住杠铃于大腿前方。","保持手臂伸直，向前向上举起杠铃，直至达到肩部水平。","在顶部停顿片刻，然后慢慢将杠铃放回起始位置。","重复所需的重复次数。"] },
  { id: "0299", name: "哑铃古巴推举", en: "dumbbell cuban press", body_part: "shoulders", equipment: "dumbbell", target: "三角肌", muscle_group: "三头肌", secondary_muscles: ["三头肌", "上背部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0299-QfAKy1G.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0299-QfAKy1G.gif", steps: ["双脚分开与肩同宽站立，双手各握一个哑铃，与肩同高，手掌朝下。","保持核心收紧，肘部稍微弯曲，将哑铃向上举过头顶，直到手臂完全伸展。","旋转手腕，使手掌朝前。","慢慢地将哑铃放回起始位置，同时将手腕旋转回起始位置。","重复所需的重复次数。"] },
  { id: "0415", name: "哑铃站姿交替侧平举", en: "dumbbell standing alternate raise", body_part: "shoulders", equipment: "dumbbell", target: "三角肌", muscle_group: "斜方肌", secondary_muscles: ["斜方肌", "前臂"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0415-SxHteRW.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0415-SxHteRW.gif", steps: ["双脚分开与肩同宽站立，双手各握一个哑铃，手掌朝向身体。","保持背部挺直，核心肌群参与。","将一个哑铃举到一侧，保持手臂伸直，手掌朝下。","继续抬起，直到手臂与地面平行。","在最高点暂停片刻，然后慢慢将哑铃放回起始位置。","用另一只手臂重复上述步骤。","双臂交替进行所需的重复次数。"] },
  { id: "0772", name: "史密斯颈后推举", en: "smith standing behind head military press", body_part: "shoulders", equipment: "smith machine", target: "三角肌", muscle_group: "三头肌", secondary_muscles: ["三头肌", "上背部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0772-ht8xDrP.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0772-ht8xDrP.gif", steps: ["调整史密斯机的座椅高度，使杠铃与肩部齐平。","双脚分开与肩同宽站立，膝盖稍微弯曲。","正手握住杠铃，握距略宽于肩宽。","将杠铃从架子上抬起并向后退一步，保持稳定的姿势。","将杠铃放在脑后，放在斜方肌上部。","在整个练习过程中保持核心收紧并抬起胸部。","伸展双臂，完全伸直，将杠铃推过头顶。","在动作的最高点稍作停顿，然后慢慢将杠铃放回起始位置。","重复所需的重复次数。"] },
  { id: "0018", name: "毛巾辅助站姿臂屈伸", en: "assisted standing triceps extension (with towel)", body_part: "upper arms", equipment: "assisted", target: "三头肌", muscle_group: "肩部", secondary_muscles: ["肩部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0018-7HcfMBP.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0018-7HcfMBP.gif", steps: ["双脚分开与肩同宽站立，双手握住毛巾放在脑后。","保持肘部靠近耳朵，上臂保持静止。","慢慢向上伸展前臂，在顶部挤压三头肌。","暂停片刻，然后慢慢将毛巾放回起始位置。","重复所需的重复次数。"] },
  { id: "0352", name: "哑铃中立卧推", en: "dumbbell neutral grip bench press", body_part: "upper arms", equipment: "dumbbell", target: "三头肌", muscle_group: "胸部", secondary_muscles: ["胸部", "肩部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0352-pP8wP2P.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0352-pP8wP2P.gif", steps: ["平躺在长凳上，双脚平放在地上，背部紧贴长凳。","每只手握一个哑铃，中立握法，双臂伸直越过胸部。","慢慢地将哑铃降低到胸部，保持肘部靠近身体。","在底部停顿片刻，然后将哑铃推回起始位置，完全伸展手臂。","重复所需的重复次数。"] },
  { id: "0986", name: "弹力带单臂头顶弯举", en: "band one arm overhead biceps curl", body_part: "upper arms", equipment: "band", target: "二头肌", muscle_group: "前臂", secondary_muscles: ["前臂", "肩部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0986-UNAB8ak.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0986-UNAB8ak.gif", steps: ["双脚分开与肩同宽站立，将弹力带的一端放在脚下。","握住弹力带的另一端，手臂完全伸过头顶，手掌朝前。","保持上臂静止，将前臂向肩膀弯曲，挤压二头肌。","在顶部停顿片刻，然后慢慢将前臂放回起始位置。","重复所需的重复次数，然后换臂。"] },
  { id: "1683", name: "史密斯机弯举", en: "smith machine bicep curl", body_part: "upper arms", equipment: "smith machine", target: "二头肌", muscle_group: "前臂", secondary_muscles: ["前臂"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/1683-zILLZ98.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1683-zILLZ98.gif", steps: ["将史密斯机杆的高度调整到腰部水平。","面对史密斯机站立，双脚与肩同宽。","反手握住杠铃，双手间距略大于肩宽。","保持肘部靠近身体两侧，上臂保持静止。","呼气并将杠铃向上卷向肩膀，收缩二头肌。","在动作的最高点暂停片刻，挤压你的二头肌。","吸气并慢慢将杠铃放回起始位置。","重复所需的重复次数。"] },
  { id: "0079", name: "杠铃反握腕弯举", en: "barbell revers wrist curl v. 2", body_part: "lower arms", equipment: "barbell", target: "前臂", muscle_group: "二头肌", secondary_muscles: ["二头肌", "肱肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0079-qDnGfDb.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0079-qDnGfDb.gif", steps: ["坐在长凳上，双脚平放在地上，膝盖弯曲。","正手握住杠铃，手掌朝下，双手与肩同宽。","将前臂放在大腿上，让手腕悬在边缘。","保持前臂静止，呼气并尽可能向上弯曲手腕。","保持收缩位置短暂停顿，然后吸气并慢慢将杠铃放回起始位置。","重复所需的重复次数。"] },
  { id: "0455", name: "手指卷曲", en: "finger curls", body_part: "lower arms", equipment: "barbell", target: "前臂", muscle_group: "腕屈肌", secondary_muscles: ["腕屈肌", "握力肌群"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0455-awG04cF.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0455-awG04cF.gif", steps: ["坐在长凳上，双脚平放在地面上，反手握住杠铃，手掌朝上。","将前臂放在大腿上，让手腕悬在边缘。","慢慢地将手指向手掌弯曲，紧紧挤压杠铃。","保持收缩一会儿，然后慢慢松开手指回到起始位置。","重复所需的重复次数。"] },
  { id: "0001", name: "四分之三仰卧起坐", en: "3/4 sit-up", body_part: "waist", equipment: "body weight", target: "腹肌", muscle_group: "髋屈肌", secondary_muscles: ["髋屈肌", "下背部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0001-2gPfomN.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0001-2gPfomN.gif", steps: ["平躺，膝盖弯曲，双脚平放在地上。","将双手放在脑后，肘部朝外。","收紧腹肌，慢慢将上半身抬离地面，向前卷曲，直到躯干呈 45 度角。","在顶部停顿片刻，然后慢慢将上半身放回起始位置。","重复所需的重复次数。"] },
  { id: "0467", name: "大猿式引体", en: "gorilla chin", body_part: "waist", equipment: "body weight", target: "腹肌", muscle_group: "前臂", secondary_muscles: ["前臂", "二头肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0467-bmwlYvD.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0467-bmwlYvD.gif", steps: ["双脚分开与肩同宽站立，膝盖稍微弯曲。","正手握住引体向上杆，握距略宽于肩宽。","悬挂在杠上，双臂完全伸展，手掌背向自己。","收紧核心肌群，将身体拉向杠铃杆，将下巴置于杠铃上方。","在顶部停顿片刻，然后慢慢将身体放回起始位置。","重复所需的重复次数。"] },
  { id: "0840", name: "负重稳定球卷腹", en: "weighted overhead crunch (on stability ball)", body_part: "waist", equipment: "weighted", target: "腹肌", muscle_group: "腹外斜肌", secondary_muscles: ["腹外斜肌", "下背部"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0840-xmM75XG.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0840-xmM75XG.gif", steps: ["坐在稳定球上，双脚平放在地面上，膝盖弯曲成 90 度角。","双手握住杠铃片或哑铃，并将手臂伸过头顶。","收紧腹肌，慢慢向前弯曲躯干，使胸部靠近膝盖。","在顶部暂停片刻，然后慢慢将躯干放回起始位置。","重复所需的重复次数。"] },
  { id: "2206", name: "健腹轮反向卷腹", en: "roller reverse crunch", body_part: "waist", equipment: "roller", target: "腹肌", muscle_group: "髋屈肌", secondary_muscles: ["髋屈肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/2206-SKXQAx3.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2206-SKXQAx3.gif", steps: ["平躺，双臂伸直过头顶，双腿伸直在身前。","将滚轮放在双脚之间，并用脚趾抓住它。","收紧腹肌，将双腿抬离地面，将膝盖向胸部弯曲，将滚轮向身体方向滚动。","在顶部停顿片刻，然后慢慢将双腿放回起始位置，将滚轮滚离身体。","重复所需的重复次数。"] },
  { id: "0501", name: "开合跳波比", en: "jack burpee", body_part: "cardio", equipment: "body weight", target: "心血管系统", muscle_group: "股四头肌", secondary_muscles: ["股四头肌", "腘绳肌", "小腿", "肩部", "三头肌", "核心"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0501-mr7pkqP.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0501-mr7pkqP.gif", steps: ["从站立位置开始，双脚分开与肩同宽。","将身体降低至蹲姿，将双手放在身前的地面上。","双脚向后踢，以俯卧撑姿势落地。","进行俯卧撑，将胸部降低到地面，然后再向上推。","双脚向前跳，以蹲姿落地。","爆发性地跳起，将双臂举过头顶。","轻轻落地并立即回到蹲姿，开始下一次重复。"] },
  { id: "2311", name: "爬梯机行走", en: "walking on stepmill", body_part: "cardio", equipment: "stepmill machine", target: "心血管系统", muscle_group: "股四头肌", secondary_muscles: ["股四头肌", "腘绳肌", "臀大肌", "小腿"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/2311-j9Q5crt.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2311-j9Q5crt.gif", steps: ["将步进机调整到舒适的水平。","走上机器，将双手放在扶手上以获得支撑。","开始行走时，将一只脚放在台阶上，然后将另一只脚放在台阶上，双腿交替。","保持直立姿势并锻炼核心肌肉。","继续步行所需的时间或距离。","当您对锻炼感到更加舒适时，逐渐增加强度或速度。","完成练习后记得冷静下来并伸展身体。"] },
  { id: "3318", name: "360 度摆臂", en: "swing 360", body_part: "cardio", equipment: "body weight", target: "心血管系统", muscle_group: "肩部", secondary_muscles: ["肩部", "核心"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/3318-tnaj0mT.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3318-tnaj0mT.gif", steps: ["站立，双脚分开与肩同宽，膝盖稍微弯曲。","将双臂伸直在身前，与地面平行。","启动你的核心并以圆周运动摆动你的手臂，同时旋转你的躯干。","继续圆周运动，摆动手臂并旋转躯干，达到所需的重复次数。","记住在整个练习过程中保持呼吸。"] },
  { id: "0716", name: "颈部侧推拉伸", en: "side push neck stretch", body_part: "neck", equipment: "body weight", target: "肩胛提肌", muscle_group: "斜方肌", secondary_muscles: ["斜方肌", "胸锁乳突肌"], image: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0716-oQRJYkC.jpg", gif: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0716-oQRJYkC.gif", steps: ["站直或坐直，肩膀放松。","将头向右倾斜，将右耳靠近右肩。","将右手放在头部左侧，轻轻施加压力以增加拉伸。","保持拉伸 15-30 秒。","在另一侧重复，将头向左倾斜并用左手施加压力。","每侧重复拉伸 2-3 次。"] },
];

function findExercise(id) {
  return EXERCISES.find((e) => e.id === id);
}

const PLANS = [
  {
    id: "p1",
    name: "推日 · 胸肩三头",
    tag: "今日训练",
    day: "星期二",
    duration: 52,
    exerciseIds: ["1299", "0299", "0018", "0501"],
    targetSets: { "1299": 4, "0299": 3, "0018": 3, "0501": 3 },
    targetReps: { "1299": "10", "0299": "12", "0018": "15", "0501": "20" },
  },
  {
    id: "p2",
    name: "拉日 · 背部二头",
    tag: "",
    day: "星期四",
    duration: 48,
    exerciseIds: ["0007", "1018", "0986", "1683"],
    targetSets: { "0007": 4, "1018": 3, "0986": 3, "1683": 3 },
    targetReps: { "0007": "10", "1018": "15", "0986": "12", "1683": "10" },
  },
  {
    id: "p3",
    name: "腿日 · 力量循环",
    tag: "",
    day: "星期六",
    duration: 55,
    exerciseIds: ["0513", "1757", "0088", "0001"],
    targetSets: { "0513": 4, "1757": 3, "0088": 4, "0001": 3 },
    targetReps: { "0513": "12", "1757": "10", "0088": "15", "0001": "20" },
  },
];

const LOG_HISTORY = [
  { id: "l1", date: "今天 · 07:42", planName: "推日 · 胸肩三头", duration: 49, volume: 4820, sets: 14 },
  { id: "l2", date: "周日 · 18:20", planName: "拉日 · 背部二头", duration: 45, volume: 4310, sets: 13 },
  { id: "l3", date: "周五 · 07:35", planName: "腿日 · 力量循环", duration: 58, volume: 6120, sets: 15 },
  { id: "l4", date: "周三 · 19:05", planName: "推日 · 胸肩三头", duration: 51, volume: 4650, sets: 14 },
  { id: "l5", date: "上周日 · 08:10", planName: "拉日 · 背部二头", duration: 43, volume: 4100, sets: 12 },
];

const WEEKLY_VOLUME = [
  { label: "一", value: 0 },
  { label: "二", value: 4820 },
  { label: "三", value: 0 },
  { label: "四", value: 4650 },
  { label: "五", value: 6120 },
  { label: "六", value: 0 },
  { label: "日", value: 4310 },
];

const STREAK_CALENDAR = (() => {
  // 35 days, deterministic pseudo-pattern so the heatmap looks organic, not random noise on every reload.
  const pattern = [0,2,3,0,1,2,3,3,0,2,2,3,1,0,3,3,2,0,1,3,3,2,0,2,3,3,1,0,2,3,3,2,0,1,3];
  return pattern;
})();

const PERSONAL_RECORDS = [
  { name: "杠铃卧推", value: "82.5 kg", date: "6月28日" },
  { name: "杠铃深蹲", value: "105 kg", date: "6月21日" },
  { name: "硬拉", value: "130 kg", date: "6月14日" },
];

const COMMUNITY_POSTS = [
  {
    id: "c1",
    name: "阿泽",
    avatarHue: 18,
    time: "23分钟前",
    tag: "推日 · 胸肩三头 · 49分钟",
    text: "今天上斜卧推破了个人记录，握距调窄了一点，胸部顶峰收缩感明显强了不少。",
    likes: 28,
    liked: false,
    comments: [
      { name: "小林", text: "握距窄一点确实对内侧胸肌刺激更大" },
      { name: "阿泽", text: "对，下次试试哑铃版本" },
    ],
  },
  {
    id: "c2",
    name: "夏至",
    avatarHue: 265,
    time: "1小时前",
    tag: "腿日 · 力量循环 · 58分钟",
    text: "深蹲加到105kg了，深蹲机位上的镶脚垫真的救了我的下背部，推荐给同样有旧伤的朋友。",
    likes: 41,
    liked: true,
    comments: [{ name: "老K", text: "镶脚垫哪个牌子的，求链接" }],
  },
  {
    id: "c3",
    name: "阿贾",
    avatarHue: 200,
    time: "3小时前",
    tag: "拉日 · 背部二头 · 45分钟",
    text: "连续训练第12天，今天状态一般但还是把计划完成了。有时候完成比完美更重要。",
    likes: 63,
    liked: false,
    comments: [
      { name: "夏至", text: "坚持才是最难的部分，加油" },
      { name: "小林", text: "12天了，真的稳" },
    ],
  },
  {
    id: "c4",
    name: "米粒",
    avatarHue: 340,
    time: "昨天",
    tag: "有氧 · 32分钟",
    text: "爬梯机20分钟配合波比跳收尾，心率维持在150左右，出汗量拉满。",
    likes: 19,
    liked: false,
    comments: [],
  },
];

const COACH_QUICK_REPLIES = ["帮我制定训练计划", "这个动作怎么做", "训练后该怎么吃"];

const COACH_RESPONSES = {
  "帮我制定训练计划": "可以，先说说你的目标：增肌、减脂还是提升力量？再告诉我每周能训练几次，我按你的时间和器械条件给你排一份计划。",
  "这个动作怎么做": "把动作名称发给我，我可以拆解成分步要领，并提示常见的代偿错误，帮你判断该注意哪些细节。",
  "训练后该怎么吃": "训练后30-60分钟内补充蛋白质和碳水最理想，比例大致1:2到1:3。举例：一份鸡胸配一碗米饭，或一勺乳清蛋白配一根香蕉，都是不错的选择。",
  "default": "收到，我正在根据你最近的训练记录整理建议，稍等我把要点列给你。",
};

const PROFILE = {
  name: "Alex",
  level: "进阶 · 已训练 128 天",
  streak: 12,
  totalSessions: 156,
  totalHours: 128,
};

const MENU_ITEMS = [
  { icon: "calendar-check", label: "我的计划", target: "training:plan" },
  { icon: "clock-counter-clockwise", label: "训练记录", target: "training:log" },
  { icon: "heart", label: "收藏的动作", target: "library" },
  { icon: "chat-circle-dots", label: "AI 教练", target: "coach" },
  { icon: "crown-simple", label: "会员", target: "toast:会员中心即将上线" },
  { icon: "bell", label: "通知设置", target: "toast:通知设置即将上线" },
  { icon: "question", label: "帮助与反馈", target: "toast:感谢反馈，我们会尽快处理" },
];
