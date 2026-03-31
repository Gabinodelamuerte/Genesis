import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

const CGU = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar text-gray-300">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">CONDITIONS GÉNÉRALES D’UTILISATION (CGU)</h1>
              <p className="text-slate-400 text-sm">Date de dernière mise à jour : 31/03/2026</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          
          <p className="mb-4">
            Genesis est une solution bancaire innovante éditée par la société Genesis SAS, au capital de 1 000 000 euros, dont le siège social se situe 10, rue de la Paix, 75002 Paris, inscrite au registre du commerce et des sociétés de Paris sous le numéro 123 456 789 (ci-après « Genesis »).
          </p>

          <p className="mb-4">
            Les présentes conditions générales d’utilisation (ci-après « Conditions Générales d’Utilisation ») visent à définir les modalités d’accès et d’utilisation du Site Web et de l’Application Genesis par tout Utilisateur.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">1. Définitions</h2>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>« Compte » : compte individuel de l’Utilisateur permettant d’accéder aux Services.</li>
            <li>« Identifiant » : adresse email renseignée lors de l’Inscription.</li>
            <li>« Mot de passe » : code personnel, exclusif et confidentiel de l’Utilisateur.</li>
            <li>« Plateforme » : désigne indifféremment le Site Web et/ou l’Application Genesis.</li>
            <li>« Services » : ensemble des services bancaires et financiers fournis par Genesis.</li>
            <li>« Utilisateur » : toute personne physique accédant à la Plateforme.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">2. Champ d’application</h2>
          <p className="mb-4">
            En accédant à la Plateforme, l’Utilisateur accepte expressément et sans réserve les présentes Conditions Générales d’Utilisation. Genesis se réserve la possibilité de modifier ces conditions à tout moment.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">3. Inscription et création de Compte</h2>
          <p className="mb-4">
            La création d’un Compte est gratuite. L’Utilisateur s’engage à fournir des informations exactes et à maintenir son Compte à jour. Les Identifiants et Mots de passe sont strictement personnels et confidentiels.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">4. Accès et utilisation des Services</h2>
          <p className="mb-4">
            L’Utilisateur s’engage à utiliser la Plateforme conformément à sa destination. Il est strictement interdit d’utiliser la Plateforme pour des activités illicites, frauduleuses ou portant atteinte aux droits de tiers.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">5. Propriété intellectuelle</h2>
          <p className="mb-4">
            Genesis est propriétaire de l’ensemble des droits sur la Plateforme (marques, logos, textes, images, graphismes). Toute reproduction ou représentation non autorisée est strictement interdite.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">6. Données personnelles</h2>
          <p className="mb-4">
            Genesis collecte et traite les données personnelles des Utilisateurs dans le respect du RGPD. Pour plus d'informations, consultez notre politique de confidentialité disponible sur notre site.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">7. Suppression et suspension du Compte</h2>
          <p className="mb-4">
            L’Utilisateur peut supprimer son Compte à tout moment. Genesis se réserve le droit de suspendre ou fermer un Compte en cas de manquement grave aux présentes conditions.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">8. Responsabilité</h2>
          <p className="mb-4">
            Genesis met tout en œuvre pour assurer l'accès à la Plateforme 24h/24, 7j/7, sous réserve des périodes de maintenance. Genesis ne saurait être tenue responsable des dommages inhérents à l’utilisation d’Internet.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">9. Réclamations</h2>
          <p className="mb-4">
            Pour toute réclamation, l’Utilisateur peut contacter le service client via le formulaire de contact disponible sur la Plateforme.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">10. Loi applicable et litiges</h2>
          <p className="mb-4">
            Les présentes CGU sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents.
          </p>
        </div>
        
        <div className="p-8 bg-slate-950/50 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CGU;
