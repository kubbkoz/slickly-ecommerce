export interface Category {
  slug: string
  name: string
  description: string
  image: string
}

export const categories: Category[] = [
  {
    slug: 'karoseria',
    name: 'Karoséria',
    description: 'Keramická ochrana, vosky a leštenky pre dokonalý lak.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOw3lcJ-AW0k4WJ8N4g4_VB8pU10OCmDputy-CLuk2mBkMaDK_qhDpSZ7Q-pMcsb78ykOvxV4ejEjcoMPVNeJBvF_5Gk7Qb5ndRTPF9XBAMcLXXtnDdKskLjMKFm_XFVk1XRvfkUTaPGyKbG6LcULbKIEa70zN2NjmWfdqvsJoKkWHNcTTX8xOkfLVHSkZTq7VEsoShRn41t2ipTpzn9ao8g0xtHmZHD9Ey65uYxPSasbgL9KjsJ7LejJDgXq_Z2yfhiU1V4vWVvhX',
  },
  {
    slug: 'interier',
    name: 'Interiér',
    description: 'Čistiace a ochranné prípravky pre kožu, plasty a textil.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ulpuUATLaBjL8jZ7MD9WYEi75v_DgL6trCmYqofHu0G_XAx4JA1WFl7RyjGxdrGBhDYT3D0le7ZqvZy36-69ygRqVUORR3xl5NwRc7t2SHSaV7hCGdkPWlAoQtU8nem4COrGFysNWiS3_S6fjidq_wnygm4t5d15_pUHS-sKaEQNUxVcyN50KS9Qw1gG7ZT5UEwGtg5-rngYNUVXsXSi2VLkz5-JAmnZds2186rAiDj5jm020E3I3Srr4bNwfacNiGtsHU9u3hAB',
  },
  {
    slug: 'kolesa',
    name: 'Kolesá',
    description: 'Disky, pneumatiky a ochrana proti brzdovému prachu.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjJhaegdVwDaUbbbxP7bA-jd2n0qC0zIeXdAJNfRLjPz_3GxRHtkS2n6H9b7KYI8dPpEo3Xnkbj9BYmiTIgRK9AF_4InoaBujMAQowcAm8o6MCeQyPiZAeWpUokziyU4BB-6b_UnWLZR4-D2o9Gr4bSL4KBF_nWHTKmfFkM7a_o2rF9O39Lig1d7GAPVLoPaYoh5bbTDQO2spYJJ1O2EiJMYQVHrn2EgngAUNtLHNmKLsYPxLsv3mvY44XA6BXnTZgiOpr2-d4mZ3n',
  },
  {
    slug: 'ochrana',
    name: 'Ochrana',
    description: 'Hydrofóbne nano-vrstvy a dekontaminačné prípravky.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDq1ViUcjBlJwvLwQHWabkgSVZR9HtWnfxWrK-lIinx97BX5vgGvZwiGwcZLiZlXHBEc1eL_1jFvDrdag-p9DeU14Ik55ESI1jpG6aftFLfFca5yKBpDn-F5vPeGvKTqSixPkwjeN9HAGV2vWE1CFXskisv9jaA_isNPuUSMs5T42ATBPVE2aEnfkNKTDfas0efD-sXi99u5832YJSDh9XSEc2sdnI4SyTd5Fn0Jj76xstx87HQxqHwGa6NHkzRN4UYxabyJVYYxyFB',
  },
]
