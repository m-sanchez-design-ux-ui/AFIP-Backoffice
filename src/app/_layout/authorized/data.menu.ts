export class MenuDataService {
  getMenuButtons() {
    return [
      {
        title: 'Archivos',
        link: '/dashboard-list',
        icon: 'home',
        collapse: false,
        disable: false,
      },
      {
        title: 'Archivos consolidados',
        link: '/consolidated-files',
        icon: 'file-text',
        collapse: false,
        disable: false,
      },
      // {
      //   title: 'Lotes',
      //   link: null,
      //   icon: 'bar-chart-2',
      //   collapse: {
      //     items: [
      //       {
      //         title: 'Importar lotes',
      //         modal: '',
      //         link: '/batch/import-data',
      //         subCollapse: false
      //       },
      //       {
      //         title: 'Listado de lotes',
      //         modal: '',
      //         link: '/batch/list',
      //         subCollapse: false
      //       }
      //     ]
      //   }
      // },
      // {
      //   title: 'Distribuciones',
      //   link: '/distribution',
      //   icon: 'layers',
      //   collapse: false,
      // },
      // {
      //   title: 'Configuración',
      //   link: null,
      //   icon: 'settings',
      //   collapse: {
      //     items: [
      //       {
      //         title: 'Gestion de usuarios',
      //         modal: '',
      //         link: '/users-admin',
      //         subCollapse: false
      //       }
      //     ]
      //   }
      // }
    ];
  }
}
